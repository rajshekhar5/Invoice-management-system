import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({
    id: null,
    invoice_number: '',
    customer_name: '',
    date: '',
    details: [],
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const API_URL = 'http://127.0.0.1:8000/api/invoices/';

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(API_URL);
      setInvoices(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle detail changes
  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...form.details];
    updatedDetails[index][field] = value;
    setForm({ ...form, details: updatedDetails });
  };

  // Add detail
  const addDetail = () => {
    setForm({
      ...form,
      details: [...form.details, { description: '', quantity: 0, unit_price: 0 }],
    });
  };

  // Remove detail
  const removeDetail = (index) => {
    const updatedDetails = form.details.filter((_, i) => i !== index);
    setForm({ ...form, details: updatedDetails });
  };

  // Submit invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure the details field is correctly included in the payload
    const payload = {
      invoice_number: form.invoice_number,
      customer_name: form.customer_name,
      date: form.date,
      details: form.details.map((detail) => ({
        description: detail.description,
        quantity: Number(detail.quantity),
        unit_price: Number(detail.unit_price),
      })),
    };
  
    const method = isUpdating ? axios.put : axios.post;
    const url = isUpdating ? `${API_URL}${form.id}/` : API_URL;
  
    try {
      await method(url, payload);
      fetchInvoices();
      resetForm();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };
  

  // Delete invoice
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  // Edit invoice
  const handleEdit = (invoice) => {
    setForm(invoice);
    setIsUpdating(true);
  };

  // Reset form
  const resetForm = () => {
    setForm({
      id: null,
      invoice_number: '',
      customer_name: '',
      date: '',
      details: [],
    });
    setIsUpdating(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Invoice Manager</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-8"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="invoice_number">
            Invoice Number
          </label>
          <input
            type="text"
            id="invoice_number"
            name="invoice_number"
            value={form.invoice_number}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="customer_name">
            Customer Name
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={form.customer_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Details</h2>
          {form.details.map((detail, index) => (
            <div key={index} className="mb-4 flex items-center gap-4">
              <input
                type="text"
                placeholder="Description"
                value={detail.description}
                onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={detail.quantity}
                onChange={(e) => handleDetailChange(index, 'quantity', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-24"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Unit Price"
                value={detail.unit_price}
                onChange={(e) => handleDetailChange(index, 'unit_price', e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-24"
                required
              />
              <button
                type="button"
                onClick={() => removeDetail(index)}
                className="bg-red-500 text-white px-3 py-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDetail}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Add Detail
          </button>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isUpdating ? 'Update' : 'Create'} Invoice
          </button>
          {isUpdating && (
            <button
              onClick={resetForm}
              className="ml-4 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Invoice List */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 border">Invoice Number</th>
              <th className="py-2 px-4 border">Customer Name</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition">
                <td className="py-2 px-4 border">{invoice.invoice_number}</td>
                <td className="py-2 px-4 border">{invoice.customer_name}</td>
                <td className="py-2 px-4 border">{invoice.date}</td>
                <td className="py-2 px-4 border flex gap-2">
                  <button
                    onClick={() => handleEdit(invoice)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                                        onClick={() => handleDelete(invoice.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                    
                          {/* Invoice Details Viewer */}
                          {isUpdating && form.details.length > 0 && (
                            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-8">
                              <h2 className="text-lg font-semibold text-gray-800 mb-4">Invoice Details</h2>
                              <table className="w-full table-auto text-left border-collapse">
                                <thead>
                                  <tr className="bg-gray-100 text-gray-700">
                                    <th className="py-2 px-4 border">Description</th>
                                    <th className="py-2 px-4 border">Quantity</th>
                                    <th className="py-2 px-4 border">Unit Price</th>
                                    <th className="py-2 px-4 border">Line Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {form.details.map((detail, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition">
                                      <td className="py-2 px-4 border">{detail.description}</td>
                                      <td className="py-2 px-4 border">{detail.quantity}</td>
                                      <td className="py-2 px-4 border">{detail.unit_price}</td>
                                      <td className="py-2 px-4 border">
                                        {(detail.quantity * detail.unit_price).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    };
                    
                    export default InvoiceManager;
                    
