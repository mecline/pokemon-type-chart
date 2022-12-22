import React from 'react';
import MaterialTable from 'material-table';
import { generateTableData } from './DamageCalculator';

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

    render() {
        const { typeChart } = this.props;

        this.tableData = generateTableData(typeChart);

        return (
            <div>
                {this.tableData && <div style={{ maxWidth: '100%' }}>
                    <MaterialTable
                        columns={[
                            { title: 'x2 Damage', field: 'doubleDamage' },
                            { title: '0.5 Damage', field: 'halfDamage' },
                            { title: 'No Damage', field: 'noDamage' }
                        ]}
                        data={this.tableData}
                        title="Type Matchups"
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