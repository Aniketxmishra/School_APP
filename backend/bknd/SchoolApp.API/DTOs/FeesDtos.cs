namespace SchoolApp.API.DTOs;

// Fee Structure DTOs
public class FeeStructureDto
{
    public long Id { get; set; }
    public string FeeHeadName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string BillingCycle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class StudentFeeDetailsDto
{
    public long StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public decimal TotalFees { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal TotalDue { get; set; }
    public List<StudentFeeItemDto> FeeDetails { get; set; } = new();
}

public class StudentFeeItemDto
{
    public int FeeHeadId { get; set; }
    public string FeeName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal RemainingAmount { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
}

public class FeePaymentDto
{
    public long Id { get; set; }
    public long StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public int FeeHeadId { get; set; }
    public string FeeHeadName { get; set; } = string.Empty;
    public decimal AmountPaid { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMode { get; set; } = string.Empty;
    public string? TransactionRef { get; set; }
    public string? ReceiptNo { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class RecordPaymentRequest
{
    public long StudentId { get; set; }
    public int FeeHeadId { get; set; }
    public decimal AmountPaid { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMode { get; set; } = string.Empty; // Cash, Online, Cheque
    public string? TransactionRef { get; set; }
}
