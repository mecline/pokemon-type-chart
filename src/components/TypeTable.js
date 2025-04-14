import React from 'react';
import MaterialTable from 'material-table';
import { generateTableData } from './DamageCalculator';
import { typeImages } from '../data/types';
import Paper from '@material-ui/core/Paper';

class TypeTable extends React.Component {
    constructor() {
        super();
        this.tableData = {};
    }

    componentDidUpdate(prevProps) {
        if (prevProps.typeChart !== this.props.typeChart) {
            this.tableData = generateTableData(this.props.tableData);
        }
    }

    customRowRender(rowObject) {
        let imagesList = [];
        let rowTypes = rowObject.split(',');
        rowTypes.forEach(type => {
            typeImages.map(image =>
                type.includes(image.name) && imagesList.push(image.image)
            )
            return imagesList;
        })
        
        return (
            <div className="type-image-container">
                {imagesList.map((image, key) => (
                    <img 
                        key={key} 
                        src={image} 
                        alt={image.split('_')[1].split('.')[0]} 
                    />
                ))}
            </div>
        );
    }

    render() {
        const { typeChart, offense } = this.props;

        this.tableData = generateTableData(typeChart);
        
        // The correct column headers based on offense mode (true = strengths, false = weaknesses)
        const columnHeaders = offense ? 
            ['Super effective against', 'Not very effective against', 'No effect against'] :
            ['Weak to', 'Resistant to', 'Immune to'];

        const columnStyle = {
            width: '33.33%',
            padding: '16px'
        };

        const headerStyle = {
            ...columnStyle,
            color: 'white',
            fontWeight: 'bold'
        };

        return (
            !this.props.error && this.tableData && (
                <Paper elevation={3} style={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    marginTop: 0
                }}>
                    <MaterialTable
                        components={{
                            Container: props => <div {...props} style={{ padding: 0 }} />,
                            Toolbar: () => null
                        }}
                        columns={[
                            {
                                title: columnHeaders[0], 
                                field: 'doubleDamage',
                                headerStyle: {
                                    ...headerStyle,
                                    backgroundColor: '#ff1f1f',
                                },
                                cellStyle: {
                                    ...columnStyle,
                                    backgroundColor: '#ffaaaa',
                                }
                            },
                            {
                                title: columnHeaders[1], 
                                field: 'halfDamage',
                                headerStyle: {
                                    ...headerStyle,
                                    backgroundColor: '#47ae58',
                                },
                                cellStyle: {
                                    ...columnStyle,
                                    backgroundColor: '#c8f5d0',
                                }
                            },
                            {
                                title: columnHeaders[2], 
                                field: 'noDamage',
                                headerStyle: {
                                    ...headerStyle,
                                    backgroundColor: '#3d7dca',
                                },
                                cellStyle: {
                                    ...columnStyle,
                                    backgroundColor: '#b4d4ff',
                                }
                            }
                        ].map(column => ({
                            ...column,
                            render: rowData => this.customRowRender(rowData[column.field])
                        }))}
                        data={this.tableData}
                        title={null}
                        options={{
                            search: false,
                            sorting: false,
                            filtering: false,
                            grouping: false,
                            selection: false,
                            paging: false,
                            toolbar: false,
                            headerStyle: {
                                fontWeight: 'bold'
                            },
                            rowStyle: {
                                padding: '0px'
                            },
                            fixedColumns: true,
                            padding: 'dense'
                        }}
                        style={{
                            tableLayout: 'fixed',
                            margin: 0,
                            padding: 0
                        }}
                    />
                </Paper>
            )
        )
    }
}

export default TypeTable;