import React from 'react';
import typeMatchups from '../data/typeMatchups.json';
import { Button } from '@material-ui/core';
import MaterialTable from 'material-table';

class TypeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doubleDamageTo: null,
            halfDamageTo: null,
            noDamageTo: null,
            doubleDamageFrom: null,
            halfDamageFrom: null,
            noDamageFrom: null
        };
    }

    
    handleTypeMatch(typeOne, typeTwo) {
        let doubleDamageTo = [];
        let halfDamageTo = [];
        let noDamageTo = [];
        let doubleDamageFrom = [];
        let halfDamageFrom = [];
        let noDamageFrom = [];
        Object.keys(typeMatchups).map((type) => {
            if (typeOne === type) {
                let goodMatch = typeMatchups[type].damage_relations.double_damage_to;
                let weakMatch = typeMatchups[type].damage_relations.half_damage_to;
                let ineffective = typeMatchups[type].damage_relations.noDamageTo;
                let immune = typeMatchups[type].damage_relations.no_damage_from;
                let youDied = typeMatchups[type].damage_relations.double_damage_from;
                let notDeadYet = typeMatchups[type].damage_relations.half_damage_from;
                goodMatch && goodMatch.map((name) => {
                    return doubleDamageTo.push(name.name + ' ');
                })
                weakMatch && weakMatch.map((name) => {
                    return halfDamageTo.push(name.name + ' ');
                })
                ineffective && ineffective.map((name) => {
                    return noDamageTo.push(name.name + ' ');
                })
                immune && immune.map((name) => {
                    return noDamageFrom.push(name.name + ' ');
                })
                youDied && youDied.map((name) => {
                    return doubleDamageFrom.push(name.name + ' ');
                })
                notDeadYet && notDeadYet.map((name) => {
                    return halfDamageFrom.push(name.name + ' ');
                })
            }
        })
        this.setState({
            doubleDamageTo: doubleDamageTo,
            halfDamageTo: halfDamageTo,
            noDamageTo: noDamageTo,
            doubleDamageFrom: doubleDamageFrom,
            halfDamageFrom: halfDamageFrom,
            noDamageFrom: noDamageFrom
        })
    }

    createRowData(doubleDamageTo, halfDamageTo, noDamageTo, doubleDamageFrom, halfDamageFrom, noDamageFrom) {
        return { doubleDamageTo, halfDamageTo, noDamageTo, doubleDamageFrom, halfDamageFrom, noDamageFrom }
    }

    render() {
        const { typeOne, typeTwo } = this.props;

        let tableData = [
            this.createRowData(
                this.state.doubleDamageTo,
                this.state.halfDamageTo,
                this.state.noDamageTo,
                this.state.doubleDamageFrom,
                this.state.halfDamageFrom,
                this.state.noDamageFrom
            )
        ];

        return (
            <div>
                <Button onClick={() => this.handleTypeMatch(typeOne, typeTwo)}>
                    Refresh
                </Button>

                {tableData && <div style={{ maxWidth: '100%' }}>
                    <MaterialTable
                        columns={[
                            { title: 'Double Damage To', field: 'doubleDamageTo' },
                            { title: 'Half Damage To', field: 'halfDamageTo' },
                            { title: 'No Damage To', field: 'noDamageTo' },
                            { title: 'Double Damage From', field: 'doubleDamageFrom' },
                            { title: 'Half Damage From', field: 'halfDamageFrom' },
                            { title: 'No Damage From', field: 'noDamageFrom' }
                        ]}
                        data={tableData}
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
            </div >
        )
    }
}

export default TypeInfo;