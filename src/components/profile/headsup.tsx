import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons'; // Import the blue icon
import member1Data from '../../app/data/members';

const { Title, Text } = Typography;

const HeadsUp = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <Row gutter={[16, 16]}>
        {member1Data.headsUp.map((item, index) => (
          <Col span={24} key={index}>
            <Card style={{ borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* Display the icon with blue color on the left */}
                <InfoCircleOutlined style={{ fontSize: 24, color: '#003087', marginTop: 4 }} />
                <div>
                  {/* Title for the heads-up */}
                  <Title level={4} style={{ margin: 0 }}>{item.title}</Title>
                  {/* Message for the heads-up */}
                  <Text type="secondary">{item.message}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HeadsUp;
