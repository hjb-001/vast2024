import { useEffect, useRef } from "react";
import { SmileOutlined } from "@ant-design/icons";

import { config } from "./config";
import axios from "axios";
import * as d3 from "d3";

interface NetChartProps {
    entity_id: string;
}

interface Entity_type {
    id: string,
    type: string,
    ProductServices: String,
    group: boolean, // 0: company, 1: person
    revenue: number,
    fonding_date: string,
}

interface Relation_type {
    type: string,
    source: string,
    target: string,
    start_date: string,
    end_date: string,
}

interface DataType {
    nodes: Entity_type[],
    links: Relation_type[]
}

const relationShip = [
    'FamilyRelationship', 'WorksFor', 'BeneficialOwnership', 'Shareholdership'
]

const colors = {
    'Entity': [
        'rgb(0, 170, 255)', 'green', 'black'
    ], // 0 company, 1 person, 2 current
    'Relation': [
        'rgb(250, 0, 0)', 'rgb(255, 255, 0)', 'rgb(150, 0, 255)', 'rgb(255, 10, 210)'
    ] // 0: familyship, 1: WorksFor, 3: beneficialOwnership, 4: Shareholdership
}

export default function NetChart({ entity_id }: NetChartProps) {
    const canvasRef = useRef(null);
    const netRef = useRef(null);
    const legendRef = useRef(null);

    const width: number = 750;
    const height: number = 400;
    const margin = { top: 2, right: 2, bottom: 2, left: 2 };

    function plotNetChart({ nodes, links }: DataType) {
        //1. process data
        let hierarchyData = [];  // 以entity_id为根节点的树形结构
        let queue: string[] = [entity_id];
        while(queue.length > 0){
            let cur_source = queue.pop();
            links
        }

        const linkList: Array<{ 'entity_id': { 'target': string, 'number': number }[] }> = [];
        //生成节点间存在边数量列表
        nodes.forEach
        //节点过滤，可以直接修改此处，提出一些未被选择类型的边
        const filterLinks = links.filter(d => {
            if (d['type'].split('.')[1] != 'Owns') {
                return false;
            } else {
                if (d['type'].split('.')[2] != 'BeneficialOwnership') {
                    return false;
                } else {
                    return true;
                }
            }
        })
        nodes.forEach((d: Entity_type) => {
            if(d.id === entity_id){
                d.fx = width / 2;
                d.fy = height / 2;
            }
        })
        // 力导向图的模拟实例创建
        const simulation = d3.forceSimulation(nodes);


        // 2. plot with d3

        const canvas = d3.select(canvasRef.current);
        const netchart = d3.select(netRef.current);
        canvas.call(d3.zoom().on("zoom", (zoomEvent: any) => {
            netchart.attr("transform", zoomEvent.transform);
        }))


        //2.1 绘制各条边，可以在此处对各条边进行处理
        const link = netchart.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("class", (d: any, i: number) => {
                return `link_${i}`;
            })
            .style('stroke-width', 2)
            .style("stroke", (d: any) => {
                if (d['type'].split('.')[0] == 'Event') {
                    // console.log(d['type'].split('.')[2])
                    if (d['type'].split('.')[2] == 'Shareholdership') {
                        return `${colors['Relation'][3]}`;
                    } else if (d['type'].split('.')[2] == 'BeneficialOwnership') {
                        return `${colors['Relation'][2]}`;
                    } else {
                        return `${colors['Relation'][1]}`;
                    }
                } else {
                    return `${colors['Relation'][0]}`;
                }
            })
            .on("click", (e: MouseEvent) => {
                if(e.currentTarget === null)
                    return console.error("e.currentTarget is null");
                const linkItem = links[parseInt(e.currentTarget.className['baseVal'].split('_')[1])]
                console.log(linkItem);
            })
            .on("mouseover", (e: MouseEvent ) => {
                // e.currentTarget.style.strokeWidth = 4;
                if(e.currentTarget === null) 
                    return console.error("e.currentTarget is null");
                const target = e.currentTarget as SVGLineElement;
                target.style.strokeWidth = "4";

            })
            .on("mouseleave", (e: MouseEvent) => {
                if(e.currentTarget === null) 
                    return console.error("e.currentTarget is null");
                const target = e.currentTarget as SVGLineElement;
                target.style.strokeWidth = "2";

            });

        //2.2 绘制各个节点，可以在此处对各个节点进行处理
        const node = netchart
            .append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes)
            .enter().append("circle")
                .attr("class", (d: any, i: number) => {
                    return 'node_' + i;
                })
                .attr("r", (d: Entity_type) => {
                    return 6;
                })
                .attr("fill", (d: Entity_type) => {
                    if(d.id === entity_id){
                        const xforce = d3.forceX(d.x).strength(0.);
                        const yforce = d3.forceY(d.y).strength(0.1);
                        const radial = d3.forceRadial(100, d.x, d.y).strength(0.5);
                        simulation
                            .force("link", d3.forceLink(links).id((d: Entity_type) => d.id).distance(20))
                            .force("charge", d3.forceManyBody().strength(-100))
                            .force("center", d3.forceCenter(width / 2, height / 2))
                            // .force("radial", radial)

                    
                        return colors['Entity'][2];
                    }
                    if (d.group) {
                        return colors['Entity'][1];
                    } else {
                        return colors['Entity'][0];
                    }

                }
                )
                .on("click", (e: MouseEvent) => {
                    // nodeItem = nodes[parseInt(e.currentTarget.className['baseVal'].split('_')[1])]
                    // console.log(nodeItem);
                })
                .on("mouseover", (e: MouseEvent) => {
                    if(e.currentTarget === null)
                        return console.error("e.currentTarget is null");
                    const target = e.currentTarget as SVGCircleElement;
                    target.r.baseVal.value = 12;
                })
                .on("mouseleave", (e: MouseEvent) => {
                    if(e.currentTarget === null)
                        return console.error("e.currentTarget is null");
                    const target = e.currentTarget as SVGCircleElement;
                    target.r.baseVal.value = 6;
                });
            node.append("title")
                .text((d: Entity_type) => d.id);

        console.log(nodes, links);
        //2.3 增加右上角颜色标签，此处放在一个svg内，所以会受缩放影响，后续可以放在不同的svg内
        const legend = d3.select(legendRef.current)
            .append("g").attr("class", "legend");
        for(let i = 0; i < 4; i++){
            legend.append("rect")
                .attr("x", 0)
                .attr("y", i * 20)
                .attr("width", 20)
                .attr("height", 3)
                .attr("fill", colors.Relation[i]);
            legend.append("text")
                .attr("x", 25)
                .attr("y", i * 20+5 )
                .text(relationShip[i]);
        }
     
        //每次缩放后刷新svg的函数
        simulation.on("tick", ticked);
        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }
        //拖动操作定义，此处并未使用

    };

    useEffect(() => {
        if (entity_id === "") return;
        axios.get(`${config.test_server}/findRelation/${entity_id}`)
            .then((resp) => {
                plotNetChart({ nodes: resp.data.data.nodes, links: resp.data.data.links })
            })
            .catch((err) => {
                console.log(err);
            })
        return ()=>{
            // cleanup
            console.log("cleanup")
            d3.select(netRef.current).selectAll("g").remove();
        }
    }, [entity_id])

    return (
        <div ref={canvasRef} style={{ margin: '1%' }}>
            <svg width={width} transform={`translate(${margin.left}, ${margin.top})`} height={height} style={{ border: '1px solid black' }}>
                <g ref={netRef} />
                <g ref={legendRef} transform={`translate(${width - 150}, ${20})`}/>
            </svg>
            <SmileOutlined />
        </div>
    )
}