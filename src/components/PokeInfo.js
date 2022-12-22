import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import TypeTable from './TypeTable';
import damageCalculator from './DamageCalculator';

class PokeInfo extends React.Component {
    constructor() {
        super();
        this.typeInfoRef = React.createRef();
        this.state = {
            userPokemon: 'pikachu',
            editingUserPokemon: '',
            offense: true,
            loading: true,
            pokemonName: null,
            pokemonImage: null,
            pokemonTypeOne: null,
            pokemonTypeTwo: null,
            errorMessage: ""
        };
        this.typeChart = new Map();
        this.typingDamageCalcs = [];
        this.calculatedTypeChart = [];
    }

    async componentDidMount() {
        await Promise.all([
            this.fetchAPIPokemonAndTypes(),
            this.initTypeChart()
        ])
    }

    componentDidUpdate() {
        if (this.state.loading) {
            this.typingDamageCalcs = [];
            this.initTypeChart();
            this.fetchAPIPokemonAndTypes();
        }
    }

    async fetchAPIPokemonAndTypes() {
        this.calculatedTypeChart = [];
        this.typingDamageCalcs = [];
        const pokemonData = await this.getPokemonData();
        await Promise.all(
            pokemonData.types.map(async (type) => {
                const typeAPIFetch = await this.getTypeMatch(type.type.url);
                this.typingDamageCalcs.push({
                    'type': typeAPIFetch.name,
                    'damageCalcs': typeAPIFetch.damage_relations
                })
                return (this.typingDamageCalcs);
            })
        )
        this.calculatedTypeChart = damageCalculator(this.typeChart, this.typingDamageCalcs, this.state.offense);
        this.setState({ loading: false });
    }

    async initTypeChart() {
        const typeUrl = 'https://pokeapi.co/api/v2/type/';
        const typeResponse = await fetch(typeUrl);
        if (typeResponse.status === 200) {
            let typeChartData = await typeResponse.json();
            typeChartData && typeChartData.results.map(typing => {
                return (this.typeChart.set(typing.name, 1));
            });
        }
        else {
            this.setState({
                errorMessage: "Type Chart Not Fetched",
            })
        }
    }

    async getPokemonData() {
        const url = 'https://pokeapi.co/api/v2/pokemon/' + this.state.userPokemon + '/';
        const response = await fetch(url);
        if (response.status === 200) {
            const pokemonData = await response.json();
            this.setState({
                pokemonName: pokemonData.species.name,
                pokemonTypeOne: pokemonData.types[0],
                pokemonTypeTwo: (pokemonData.types[1] ? pokemonData.types[1] : null),
                pokemonImage: (pokemonData.sprites),
                loading: false,
                errorMessage: ""
            });
            return (pokemonData);
        }
        else {
            this.setState({
                errorMessage: "That Pokemon doesn't exist in the database, check spelling or choose one with similar typing.",
            });
        }
    }

    async getTypeMatch(APIUrlForType) {
        const url = APIUrlForType;
        const response = await fetch(url);
        if (response.status === 200) {
            let typeData = await response.json();
            return (typeData);
        }
        else {
            this.setState({
                errorMessage: "An error occured when fetching type matchups.",
            });
        }
    }

    handleNameChange = (event) => {
        let newValue = event.target.value;
        this.setState({ editingUserPokemon: newValue });
    }

    handleNameSubmit = (e) => {
        e.preventDefault();
        let newPokemon = this.state.editingUserPokemon;
        this.setState({ userPokemon: newPokemon, loading: true });
    }

    handleToggleOffense = () => {
        this.setState({ offense: !this.state.offense, loading: true });
    }

    render() {
        let typeOne = this.state.pokemonTypeOne;
        let typeTwo = this.state.pokemonTypeTwo;

        return (
            <div style={{ padding: '10px', textAlign: 'center' }}>
                <Grid>
                    <TextField className="userInput"
                        variant='outlined'
                        value={this.state.editingUserPokemon}
                        onChange={this.handleNameChange}
                    />
                    <Button onClick={this.handleNameSubmit}>
                        Submit
                    </Button>
                    <Button onClick={this.handleToggleOffense}>
                        {this.state.offense ? 'Showing Offense' : 'Showing Defense'}
                    </Button>
                </Grid>

                <React.Fragment>
                    {this.state.errorMessage ? this.state.errorMessage :
                        <div className="formInline">
                            {this.state.loading ? 'Loading...' : 'You entered: ' + this.state.pokemonName + '. ' +
                                typeOne.type.name + (typeTwo && typeTwo.type.name ? ', ' + typeTwo.type.name : '')}
                            {this.state.pokemonImage ? <img src={this.state.pokemonImage.front_default} alt='Not found' /> : ''}

                        </div>
                    }
                </React.Fragment>
                <TypeTable style={{ padding: '10px' }}
                    typeChart={this.typeChart}
                    damageCalcs={this.typingDamageCalcs}
                />
            </div>
        )
    }
}

export default PokeInfo;