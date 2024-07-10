import { useState } from "react";

import { Button, Form, Space, Radio, Slider, Select, Input, Drawer, Divider, TreeSelect } from "antd";
import type { SliderSingleProps } from "antd";
import './static/selectForm.css';

interface SelectFormProps {

}
const relation_items = [
    {
        key: '1',
        label: 'Ownership',
    },
    {
        key: '2',
        label: 'Shareholdership',
    },
    {
        key: '3',
        label: 'Works For',
    },
    {
        key: '4',
        label: 'Family Relationship',
    }
];




const Entity_type_list = [
    {
        title: 'Company',
        value: 'All Company',
        key: 'All Company',
        children: [
            {
                title: 'Company',
                value: 'Entity.Organization.Company',
                key: 'Entity.Organization.Company',
            },
            {
                title: 'Fishing Company',
                value: 'Entity.Organization.FishingCompany',
                key: 'Entity.Organization.FishingCompany',
            },
            {
                title: 'Logistics Company',
                value: 'Entity.Organization.LogisticsCompany',
                key: 'Entity.Organization.LogisticsCompany',
            },
            {
                title: 'News Company',
                value: 'Entity.Organization.NewsCompany',
                key: 'Entity.Organization.NewsCompany',
            },
            {
                title: 'Financial Company',
                value: 'Entity.Organization.FinancialCompany',
                key: 'Entity.Organization.FinancialCompany',
            },
            {
                title: 'NGO',
                value: 'Entity.Organization.NGO',
                key: 'Entity.Organization.NGO',
            }
        ],
    },
    {
        title: 'Person',
        value: 'All Person',
        key: 'All Person',
        children: [
            {
                title: 'Normal',
                value: 'Entity.Person.Normal',
                key: 'Entity.Person.Normal',
            },
            {
                title: 'CEO',
                value: 'Entity.Person.CEO',
                key: 'Entity.Person.CEO',
            },
        ]
    }
];

const company_relation_ship = [
    {value: "All", label: 'All'},
    {value: 'Event.Owns.BeneficialOwnership', label: 'Ownership'},
    {value: 'Event.Owns.Shareholdership', label: 'Shareholdership'},
    {value: 'Event.WorksFor', label: 'Works For'},
];

const human_relation_ship = [
    {value: 'Relationship.FamilyRelationship', label: 'Family Relationship'},
];

interface SelectFormProps {
    onDataChange: (entity_id: string) => void;
}

export default function SelectForm({onDataChange }: SelectFormProps) {
    const [form] = Form.useForm();
    const [entityType, setEntityType] = useState<'Company'|'Human'>('Company');  // Company or Human
    const [relation, setRelation] = useState<{value: string, label: string}[]>(company_relation_ship);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [concreteEntityType, setConcreteEntityType] = useState<string[]>(['All Company']); // Entity.Organization.Company or Entity.Person.Normal

    const slider_format: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value: number | undefined) => {
        return value === undefined? undefined: `${value.toString().slice(0, 4)}-${value.toString().slice(4, 6)}-${value.toString().slice(6)}`;
    }
    
    function handleEntityTypeChange(e: any){
        setEntityType(e.target.value)
        setRelation(e.target.value === 'Company' ? company_relation_ship : human_relation_ship)
        setConcreteEntityType(e.target.value === 'Company' ? ['All Company'] : ['All Person'])
    }

    function handleConcreteEntityTypeChange(value: any){
        console.log(value);
    }

    async function handleSearch(){
        console.log(form.getFieldValue('entity_id'), form.getFieldValue('relation'));
        onDataChange(form.getFieldValue('entity_id'));
    } 

    return (
        <div>
            <Button type="primary" size="small" onClick={()=>setOpenDrawer(true)} >
                Search
            </Button>
            <Drawer
                title="Search Entity"
                placement="left"
                getContainer={false}
                style={{position: 'relative'}}
                onClose={()=>setOpenDrawer(false)}
                width={360}
                open={openDrawer}
                extra={
                    <Button type="primary" onClick={handleSearch}>Search</Button>
                }
            >
                <Form form={form}>
                    <Form.Item label="Entity"  labelCol={{span: 5}} name="entity_type" >
                        <Space>
                            <Radio.Group  value={entityType} onChange={handleEntityTypeChange}>
                                <Radio.Button value="Company">Company</Radio.Button>
                                <Radio.Button value="Human">Human</Radio.Button>
                            </Radio.Group>
                        </Space>
                    </Form.Item>
                    <Form.Item label="Entity ID" labelCol={{span: 5}} name="entity_id" >
                            {
                            /* <Cascader 
                            key={entityType}
                            options={entityType === 'Company' ? company_type : person_type} 
                            onChange={handleConcreteEntityTypeChange} 
                            placeholder="please select" /> */
                            }
                        <Input placeholder={`please input ${entityType}'s ID`} />

                    </Form.Item>
                    <Form.Item label="Relation" labelCol={{span: 5}} name="relation" >
                        <Space>
                            <Select 
                                key={entityType}
                                placeholder="Select a relation"
                                onChange={(value: string) => form.setFieldsValue({relation: value})}
                                options={relation}
                            />
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>

            <Divider orientation="left"> Filter option</Divider>
            <TreeSelect 
                treeData={Entity_type_list}
                value={concreteEntityType}
                placeholder="Please select entity type"
                treeCheckable={true}
                showCheckedStrategy="SHOW_PARENT"
                style={{width: '100%'}}
                onChange={(newValue: string[])=>{
                    setConcreteEntityType(newValue)
                }}  
            />
            <Slider range max={20400000} min = {19990000} defaultValue={[20210708, 20350401]} tooltip={{formatter: slider_format}}/>
        </div>
        
    )
}