import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InvoiceManager from './InvoiceManager';  // Adjust the import path

// Mock axios to simulate API requests
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('InvoiceManager', () => {
  test('renders the Invoice Manager title', () => {
    render(<InvoiceManager />);
    const title = screen.getByText(/Invoice Manager/i);
    expect(title).toBeInTheDocument();
  });

  test('renders form inputs', () => {
    render(<InvoiceManager />);
    const invoiceNumberInput = screen.getByLabelText(/Invoice Number/i);
    const customerNameInput = screen.getByLabelText(/Customer Name/i);
    const dateInput = screen.getByLabelText(/Date/i);
    expect(invoiceNumberInput).toBeInTheDocument();
    expect(customerNameInput).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
  });

  test('can fill the form and submit', async () => {
    render(<InvoiceManager />);

    // Simulate form inputs
    fireEvent.change(screen.getByLabelText(/Invoice Number/i), { target: { value: 'INV001' } });
    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'Raj Mallu' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-11-30' } });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Create Invoice/i));

    // Verify the API call
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/api/invoices/', {
      invoice_number: 'INV001',
      customer_name: 'Raj Mallu',
      date: '2024-11-30',
      details: [],
    });
  });

  test('can handle deleting an invoice', async () => {
    render(<InvoiceManager />);

    // Mock the API response
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, invoice_number: 'INV001', customer_name: 'Raj Mallu', date: '2024-11-30' },
      ],
    });

    // Simulate a delete button click
    fireEvent.click(screen.getByText(/Delete/i));

    // Verify the API call
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    expect(axios.delete).toHaveBeenCalledWith('http://127.0.0.1:8000/api/invoices/1/');
  });
});
