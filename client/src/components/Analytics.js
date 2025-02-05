import React from 'react';
import { Card, Row, Col, Progress } from 'antd';

const Analytics = ({ allTransactions }) => {
  const totalTransactions = allTransactions.length;
  const totalIncomeTransactions = allTransactions.filter(transaction => transaction.type === 'income').length;
  const totalExpenseTransactions = allTransactions.filter(transaction => transaction.type === 'expense').length;
  const totalIncomePercent = (totalIncomeTransactions / totalTransactions) * 100;
  const totalExpensePercent = (totalExpenseTransactions / totalTransactions) * 100;

  return (
    <Card title="Analytics" className="p-4">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
            <Progress percent={100} format={() => totalTransactions} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <h3 className="text-lg font-semibold mb-2">Total Income Transactions</h3>
            <Progress percent={totalIncomePercent} format={() => totalIncomeTransactions} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <h3 className="text-lg font-semibold mb-2">Total Expense Transactions</h3>
            <Progress percent={totalExpensePercent} format={() => totalExpenseTransactions} />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default Analytics;
