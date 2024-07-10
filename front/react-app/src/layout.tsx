import { Card, Col, Divider, Radio, Row, Select, Space } from 'antd';
import { useState } from 'react';

import NetChart from './netChart';
import SelectForm from './selectForm';


export default function Layout(){
    const [entity_id, setEntityId] = useState<string>("");

    function handleRelationChange(e: any){
    }

    return (
        <div>
            <header>
                <Row>
                    <Col span={24}>
                        <Card styles={{body: {padding: '10px', fontSize: '2vw'}}}>
                            Hello, VAST2024 ✌
                        </Card>
                    </Col>
                </Row>
            </header>
            <main>
                <Row gutter={[16, 16]} style={{margin: '20px 0'}}>
                    <Col span={18}>

                            <Card >
                                <Row>
                                    <Col span={6}>
                                        <Card  styles={{body: {padding: '10px', height: '40vh'}}}>
                                            <SelectForm onDataChange={(entity_id) => setEntityId(entity_id)}/>
                                        </Card>
                                    </Col>
                                    <Col span={18}>
                                        <NetChart  entity_id={entity_id}/> 
                                    </Col>
                                </Row>
                            </Card>   
                    </Col>
                    
                    <Col span={6}>
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
