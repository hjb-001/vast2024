import { Card, Col, Divider, Row } from 'antd';


export default function Layout(){
    return (
        <div>
            <header>
                <Row>
                    <Col span={24}>
                        <Card styles={{body: {padding: '10px', fontSize: '2vw'}}}>
                            VAST 2024 ✌
                        </Card>
                    </Col>
                </Row>
            </header>
            <main>
                <Row gutter={[16, 16]} style={{margin: '20px 0'}}>
                    <Col span={16}>
                        <Card >
                            Main Chart
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            Detail Chart
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Card>
                            Time Chart
                        </Card>
                    </Col>
                </Row>
            </main>


        </div>
    )
}
