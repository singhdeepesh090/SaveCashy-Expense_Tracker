import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Table, DatePicker } from 'antd';
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment';
import {UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import Analytics from '../components/Analytics';
const { RangePicker } = DatePicker;


const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);
  const [balance, setBalance] = useState(0);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render : (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined style={{ fontSize: '20px', color: '#08c' }} onClick={ () => {
               setEditable(record);
               setShowModal(true);
          }}/>
          <DeleteOutlined className='mx-3' style={{ fontSize: '20px', color: '#990000'}} onClick={ () => {handleDelete(record)}}/>
        </div>
      )
    },
  ]

  const getAllTransactions = async () =>{
    try{
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      const res = await axios.post('/transactions/get-transaction',{
        userid: user._id, 
        frequency,
        selectedDate,
        type
      }); 
      setLoading(false);
      setAllTransactions(res.data);
      console.log(res.data);
    }
    catch(error){
      console.log(error);
      message.error("Couldn't get transaction");
    }
  }

  const handleFormSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if (editable) {
        await axios.post('/transactions/edit-transaction', {
          payload: {
            ...values,
            userid: user._id,
          },
          transactionsId: editable._id,
        });
        setLoading(false);
        message.success('Transaction Updated successfully');
      } else {
        await axios.post('/transactions/add-transaction', {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success('Transaction added successfully');
      }

      form.resetFields();
      setEditable(null);
      setShowModal(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to add transaction');
    }
  };

  useEffect(() => {
    getAllTransactions();
    setLoading(false); 
  },[loading, frequency, selectedDate, type]);

  useEffect(() => {
    calculateBalance();
  }, [allTransactions]);

  const calculateBalance = () => {
    const income = allTransactions
      .filter((item) => item.type === 'income')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    const expense = allTransactions
      .filter((item) => item.type === 'expense')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    setBalance(income - expense);
  };

  const handleDelete = async (record) => {
    try{
      setLoading(true);
      await axios.post('/transactions/delete-transaction', {
          transactionsId: record._id,
        });
      setLoading(false);
      message.success('Transaction deleted successfully');  
    } 
    catch(error){
      setLoading(false);
      message.error('Unable to delete transaction');
    }
  }
  const [selectedOption, setSelectedOption] = useState('income');
  const [incomeCategories] = useState(['Salary', 'Bonus', 'Investments', 'Freelancing', 'Side Business','Reimbursements']);
  const [expenseCategories] = useState([
    'Transportation',
    'Dining/Restaurants',
    'Entertainment',
    'Shopping',
    'Travel/Vacation',
    'Health/Medical',
    'Education',
    'Bills/Utilities',
    'Insurance',
    'Home/Real Estate',
    'Personal Care',
    'Gifts/Donations',
    'Debt/Loans',
    'Taxes',
    'Subscriptions/Memberships',
  ]);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const renderCategoryOptions = () => {
    const categories = selectedOption === 'income' ? incomeCategories : expenseCategories;

    return categories.map((category) => (
      <Select.Option key={category} value={category}>
        {category}
      </Select.Option>
    ));
  };

  return (

    <Layout>
      
    {loading && <Spinner />}
    <div>
      <div className='flex m-5 justify-between h-12'>
      <div className="flex flex-col gap-4 bg-blue-200 border-2 border-blue-300 p-4 m-2 rounded-xl  hover:scale-105 transition-transform duration-300 ease-in-out max-w-md">
  {/* Frequency Selection */}
  <h6 className="text-l font-bold text-gray-800 tracking-wide  mb-3 transform -translate-y-3">Filters:</h6>
  <div className="flex items-center gap-3 transform -translate-y-6">
    <Select
      value={frequency}
      onChange={(value) => setFrequency(value)}
      className="w-full border border-red-900 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <Select.Option value="7">Last 1 Week</Select.Option>
      <Select.Option value="30">Last 1 Month</Select.Option>
      <Select.Option value="365">Last 1 Year</Select.Option>
      <Select.Option value="Custom">Custom</Select.Option>
    </Select>

    {/* Type Selection */}
    <Select
      value={type}
      onChange={(value) => setType(value)}
      className="w-32 border border-green-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-900"
    >
      <Select.Option value="income">Income</Select.Option>
      <Select.Option value="expense">Expense</Select.Option>
      <Select.Option value="all">All</Select.Option>
    </Select>
  </div>

  {/* Date Range Picker (Only when Custom is selected) */}
  {frequency === "Custom" && (
    <RangePicker
      value={selectedDate}
      onChange={(values) => setSelectedDate(values)}
      className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  )}
</div>

<div className="flex gap-4 text-2xl transform -translate-x-8 mt-1 justify-end ml-96">
  <UnorderedListOutlined
    onClick={() => setViewData("table")}
    className="text-4xl active:bg-blue-500"
  />
  <AreaChartOutlined
    onClick={() => setViewData("analytics")}
    className="text-4xl active:bg-blue-500"
  />
</div>

        <button
            className="bg-gray-700 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-100 ease-in-out"
            onClick={() => {
              setEditable(null); // Reset editable record before opening the modal for adding transaction
              setShowModal(true);
            }}
          >
            <svg
              className="w-6 h-6 mr-2 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Transaction
          </button>
      </div>

      <Modal
          title={editable ? "Edit Transaction" : "Add Transaction"}
          open={showModal}
          onCancel={() => setShowModal(false)}
          footer={false}
        >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={editable?editable:null}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter the title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter the amount' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please enter the type' }]}
          >
            <Select defaultValue="income" onChange={handleOptionChange}>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>  
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please enter the category' }]}
          >
            <Select defaultValue={incomeCategories[0]}>
               {renderCategoryOptions()}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please enter the category' }]}
          >
            <Input type='date'/>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <Input type='text'/>
          </Form.Item>
          <div className='flex justify-end'>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg" type='submit'>
              Save
            </button>

          </div>
        </Form>
      </Modal>
      <div className=" m-5 p-2 mb-10 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-xl border border-blue-300 w-1/6 mx-auto h-30">
  <h2 className="text-xl font-extrabold text-center mb-2 text-gray-800">Your Balance:</h2>
  <p
    className={`text-2xl text-center font-semibold px-4 py-2 rounded-lg ${
      balance >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
    }`}
  >
          ₹&nbsp;{balance.toFixed(2)}
        </p>
      </div>
      <div className='content'>
          {
            viewData === 'table'? <Table columns={columns} dataSource={allTransactions} />:<Analytics allTransactions={allTransactions}></Analytics>
          }
          
      </div>
    </div>
    </Layout>
  );
}

export default HomePage;