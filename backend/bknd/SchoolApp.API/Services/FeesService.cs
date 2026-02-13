using Microsoft.EntityFrameworkCore;
using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public class FeesService : IFeesService
{
    private readonly SchoolAppDbContext _context;

    public FeesService(SchoolAppDbContext context)
    {
        _context = context;
    }

    public async Task<StudentFeeDetailsDto?> GetStudentFeeDetailsAsync(long studentId)
    {
        var student = await _context.TbmasStudents.FindAsync(studentId);
        if (student == null) return null;

        // Get all fees due for this student
        var feesDue = await (from fd in _context.Tbfeedue
                             join fh in _context.Tbmasfeehead on fd.Fdfeeheadid equals fh.Fdid
                             where fd.Fdstudentid == studentId
                             group new { fd, fh } by new { fh.Fdid, fh.Fdname } into g
                             select new
                             {
                                 FeeHeadId = g.Key.Fdid,
                                 FeeHeadName = g.Key.Fdname,
                                 TotalDue = g.Sum(x => x.fd.Fdamountdue)
                             }).ToListAsync();

        // Get all payments made by this student
        var payments = await (from fp in _context.Tbfeepayment
                              where fp.Fdstudentid == studentId
                              group fp by fp.Fdfeeheadid into g
                              select new
                              {
                                  FeeHeadId = g.Key,
                                  TotalPaid = g.Sum(x => x.Fdamountpaid)
                              }).ToListAsync();

        var feeItems = new List<StudentFeeItemDto>();
        decimal totalFees = 0;
        decimal totalPaid = 0;

        foreach (var due in feesDue)
        {
            var paid = payments.FirstOrDefault(p => p.FeeHeadId == due.FeeHeadId)?.TotalPaid ?? 0;
            var remaining = due.TotalDue - paid;

            feeItems.Add(new StudentFeeItemDto
            {
                FeeHeadId = due.FeeHeadId,
                FeeName = due.FeeHeadName,
                Amount = due.TotalDue,
                PaidAmount = paid,
                RemainingAmount = remaining,
                PaymentStatus = remaining == 0 ? "Paid" : paid > 0 ? "Partial" : "Unpaid"
            });

            totalFees += due.TotalDue;
            totalPaid += paid;
        }

        return new StudentFeeDetailsDto
        {
            StudentId = studentId,
            StudentName = student.FdStudentName,
            TotalFees = totalFees,
            TotalPaid = totalPaid,
            TotalDue = totalFees - totalPaid,
            FeeDetails = feeItems
        };
    }

    public async Task<List<FeeStructureDto>> GetFeeStructureAsync(long classId, int? sectionId = null)
    {
        var query = from fs in _context.Tbfeestructure
                    join fh in _context.Tbmasfeehead on fs.Fdfeeheadid equals fh.Fdid
                    where fs.Fdclassid == classId && fs.Fdstatus == "Active"
                    select new { fs, fh };

        if (sectionId.HasValue)
        {
            query = query.Where(x => x.fs.Fdsectionid == sectionId);
        }

        var structures = await query.ToListAsync();

        return structures.Select(x => new FeeStructureDto
        {
            Id = x.fs.Fdid,
            FeeHeadName = x.fh.Fdname,
            Amount = x.fs.Fdamount,
            BillingCycle = x.fs.Fdbillingcycle,
            Status = x.fs.Fdstatus
        }).ToList();
    }

    public async Task<bool> RecordPaymentAsync(RecordPaymentRequest request, string recordedBy)
    {
        var student = await _context.TbmasStudents.FindAsync(request.StudentId);
        if (student == null) return false;

        var payment = new Tbfeepayment
        {
            Fdstudentid = request.StudentId,
            Fdfeeheadid = request.FeeHeadId,
            Fdamountpaid = request.AmountPaid,
            Fdpaymentdate = request.PaymentDate,
            Fdpaymentmode = request.PaymentMode,
            Fdtransactionref = request.TransactionRef,
            Fdreceiptno = GenerateReceiptNo(),
            Fdstatus = "Confirmed",
            Fdcreatedby = recordedBy,
            Fdcreatedon = DateTime.UtcNow,
            Fdaudituser = recordedBy,
            Fdauditdate = DateTime.UtcNow
        };

        await _context.Tbfeepayment.AddAsync(payment);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<FeePaymentDto>> GetPaymentHistoryAsync(long studentId)
    {
        var query = from fp in _context.Tbfeepayment
                    join s in _context.TbmasStudents on fp.Fdstudentid equals s.FdStudentId
                    join fh in _context.Tbmasfeehead on fp.Fdfeeheadid equals fh.Fdid
                    where fp.Fdstudentid == studentId
                    orderby fp.Fdpaymentdate descending
                    select new FeePaymentDto
                    {
                        Id = fp.Fdid,
                        StudentId = fp.Fdstudentid,
                        StudentName = s.FdStudentName,
                        FeeHeadId = fp.Fdfeeheadid,
                        FeeHeadName = fh.Fdname,
                        AmountPaid = fp.Fdamountpaid,
                        PaymentDate = fp.Fdpaymentdate,
                        PaymentMode = fp.Fdpaymentmode,
                        TransactionRef = fp.Fdtransactionref,
                        ReceiptNo = fp.Fdreceiptno,
                        Status = fp.Fdstatus
                    };

        return await query.ToListAsync();
    }

    private string GenerateReceiptNo()
    {
        return $"REC{DateTime.UtcNow:yyyyMMddHHmmss}{new Random().Next(100, 999)}";
    }
}
