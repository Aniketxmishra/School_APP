import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';

const PaymentDetailsPage = () => {

    const bankData = [
        ['Bank Name', 'IFSC Code', 'Account Number', 'Name as in Bank'],
        ['John Doe', 'H43n43', 342435234635, "JOHAN DOE"],
      ];


    const [rollNumber, setRollNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [loading, setLoading] = useState(false);


    const fetchPaymentDetails = async () => {
        if (!rollNumber) {
          Alert.alert('Error', 'Please enter your roll number');
          return;
        }

    setLoading(true);

    try {

      const response = await fetch(`http://localhost:4000/payment-details?rollNumber=${rollNumber}`);

      

      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }

      const data = await response.json();

      
      if (data.success) {
        const { bankName, ifscCode, accountNumber, accountHolderName } = data.paymentDetails;
        setBankName(bankName);
        setIfscCode(ifscCode);
        setAccountNumber(accountNumber);
        setAccountHolderName(accountHolderName);
      } else {
        Alert.alert('Error', 'No payment details found for the provided roll number');
      }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'There was an issue fetching payment details');
      } finally {
        setLoading(false);
      }
  };

  
    const handlePayment = () => {
      
      Alert.alert('Payment', 'Payment has been successfully made!');
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter Roll Number"
        value={rollNumber}
        onChangeText={setRollNumber}
        keyboardType="numeric"
      />
      
      <Button
        title={loading ? 'Loading...' : 'Get Payment Details'}
        onPress={fetchPaymentDetails}
        disabled={loading}
      />

        <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 50,}}>Or Send</Text>

        <ScrollView style={styles.tableContainer}>
            {bankData.map((row, rowIndex) => (
                <View
                key={rowIndex}
                style={[styles.row, rowIndex === 0 ? styles.headerRow : null]}
                >
                {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles.cell}>
                    <Text style={styles.text}>{cell}</Text>
                    </View>
                ))}
                </View>
        ))  }
        </ScrollView>


      {bankName && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Bank Name: {bankName}</Text>
          <Text style={styles.detailText}>IFSC Code: {ifscCode}</Text>
          <Text style={styles.detailText}>Account No: {accountNumber}</Text>
          <Text style={styles.detailText}>Account Holder: {accountHolderName}</Text>
          
          <Button
            title="Make Payment"
            onPress={handlePayment}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerRow: {
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
    fontSize:1,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  text: {
    fontSize: 9,
  },
});

export default PaymentDetailsPage;
