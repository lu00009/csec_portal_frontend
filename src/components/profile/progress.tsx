import { Progress, Card, Row, Col, Typography } from 'antd';
import member1Data from '@/app/data/members';
const { Title, Text } = Typography;

export default function AttendanceProgress({}) {


  return (
   
      <Card style={{ 
        backgroundColor: 'white',
        width: 700,
        maxWidth: 1000,
        borderRadius: 12,
      }}>
        {/* Main Progress Section */}
        <div style={{ textAlign: 'center', marginBottom: 32, backgroundColor: 'white', width: 300, height: 300,boxShadow: '0 4px 12px rgba(0,0,0,0.1)',

         }}>
          <h1 className='font-bold'>Overall Attendance Progress</h1>
          <br />
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
          
                  {/* Percentage Row */}
        <Row justify="space-around" style={{ marginBottom: 32, marginTop: 25 }}>
          <Col style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: 'black', margin: 0 }}>28%</Title>
            <Text type="secondary" style={{ fontSize: 14 }}>Last week</Text>
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: 'black', margin: 0 }}>56%</Title>
            <Text type="secondary" style={{ fontSize: 14 }}>Last month</Text>
          </Col>
        </Row>
        </div>



        {/* Stats Cards */}
        <Row gutter={[10, 16]} justify="center">
          {member1Data.progressData.map((item, index) => (
            <Col key={index} xs={24} sm={16} md={8}>
              <Card 
                bordered={false}
                style={{ 
                  borderRadius: 12,
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30}}>
                  <div>
                  <Progress
                    type="circle"
                    percent={item.percent}
                    strokeColor={item.color}
                    strokeWidth={10}
                    width={60}
                    format={() => (
                      <Text strong style={{ color: 'black' }}>
                        {item.percent}%
                      </Text>
                    )}
                  />
                  </div>
                  <div>                
                <Title level={3} style={{ color: 'black', margin: 0 }}>{item.label}</Title>
                <Text type="secondary" style={{ fontSize: 9, marginTop: 3,  marginLeft: 0, }}>{item.par}</Text>
                </div>
                </div>
               

              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    
  );
}