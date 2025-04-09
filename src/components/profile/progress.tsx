import { Progress, Card, Row, Col, Typography } from 'antd';
import member1Data from '@/app/data/memberdata';
const { Title, Text } = Typography;

export default function AttendanceProgress() {


  return (
    <div style={{ 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24
    }}>
      <Card style={{ 
        width: '100%',
        maxWidth: 1000,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: 24
      }}>
        {/* Main Progress Section */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Progress
            type="circle"
            percent={75}
            strokeColor="#003087"
            strokeWidth={10}
            width={150}
            format={() => (
              <Title level={3} style={{ color: 'black', margin: 0 }}>75%</Title>
            )}
          />
        </div>

        {/* Percentage Row */}
        <Row justify="space-around" style={{ marginBottom: 32 }}>
          <Col style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: 'black', margin: 0 }}>28%</Title>
            <Text type="secondary" style={{ fontSize: 14 }}>Last week</Text>
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: 'black', margin: 0 }}>56%</Title>
            <Text type="secondary" style={{ fontSize: 14 }}>Last month</Text>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} justify="center">
          {member1Data.progressData.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Card 
                bordered={false}
                style={{ 
                  borderRadius: 12,
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                  <Progress
                    type="circle"
                    percent={item.percent}
                    strokeColor={item.color}
                    strokeWidth={10}
                    width={50}
                    format={() => (
                      <Text strong style={{ color: 'black' }}>
                        {item.percent}%
                      </Text>
                    )}
                  />
                  <Title level={3} style={{ color: 'black', margin: 0 }}>{item.label}</Title>
                </div>
                <Text type="secondary" style={{ fontSize: 14, marginTop: 8,  marginLeft: 46, }}>{item.par}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}