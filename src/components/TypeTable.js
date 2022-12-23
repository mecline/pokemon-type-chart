import React from 'react';
import MaterialTable from 'material-table';
import { generateTableData } from './DamageCalculator';
import { typeImages } from '../data/types';

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
        let imgTags = [];
        let rowTypes = rowObject.split(',');
        rowTypes.forEach(type => {
            typeImages.map(image =>
                type.includes(image.name) && imagesList.push(image.image)
            )
            return imagesList;
        })
        imagesList.forEach((image, key) => {
            imgTags.push(<img key={key} style={{ height: '50px', width: '100px' }}
                src={image} alt={image.split('_')[1].split('.')[0]} />);
        })
        return (imgTags)
    }

    findImageFromTypeName(typeName) {
        let imageSrc = "";
        typeImages.map(image => {
            if (typeName.includes(image.name)) {
                imageSrc = image.image
            }
            return imageSrc;
        })
        return (<img style={{ height: '50px', width: '100px' }} src={imageSrc} alt={imageSrc.split('_')[1].split('.')[0]} />)
    }

    render() {
        const { typeChart, typeOne, typeTwo, offense } = this.props;

        this.tableData = generateTableData(typeChart);
        let typeOneTitle = (typeOne && this.findImageFromTypeName(typeOne.type.name));
        let typeTwoTitle = (typeTwo ? this.findImageFromTypeName(typeTwo.type.name) : null);

        return (
            !this.props.error &&
            <div>
                {this.tableData && <div style={{ maxWidth: '100%' }}>
                    <div style={{ justifyContent: "center", alignItems: 'center', display: 'flex' }}>
                        {typeOneTitle}
                        {typeTwoTitle}
                    </div>
                    <MaterialTable
                        columns={[
                            {
                                title: (offense ? 'Deals ' : 'Takes ') + 'x2 Damage', field: 'doubleDamage',
                                render: rowData => (this.customRowRender(rowData.doubleDamage))
                            },
                            {
                                title: (offense ? 'Deals ' : 'Takes ') + '0.5 Damage', field: 'halfDamage',
                                render: rowData => (this.customRowRender(rowData.halfDamage))
                            },
                            {
                                title: (offense ? 'Deals ' : 'Takes ') + 'No Damage', field: 'noDamage',
                                render: rowData => (this.customRowRender(rowData.noDamage))
                            }
                        ]}
                        data={this.tableData}
                        title={null}
                        options={{
                            search: false,
                            sorting: false,
                            filtering: false,
                            grouping: false,
                            selection: false,
                            paging: false
                        }}
                    />
                </div>
                }
            </div>
        )
    }
}

export default TypeTable;