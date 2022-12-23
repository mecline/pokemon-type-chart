import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import TypeTable from './TypeTable';
import damageCalculator from './DamageCalculator';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

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
        if (pokemonData) {
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
        }
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
        console.log(response.status)
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
                errorMessage: "Pokemon not found, try regional variants or check spelling.",
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

        return (
            <div style={{ padding: '100px 50px 50px 20px' }}>
                {this.state.errorMessage ? this.state.errorMessage : ''}
                <Grid container spacing={2} direction='row' justifyContent="center" alignItems='center' >
                    <Grid item xs={3}>
                        <TextField className="userInput"
                            variant='outlined'
                            value={this.state.editingUserPokemon}
                            onChange={this.handleNameChange}
                        />
                        <Button>
                            <SearchIcon onClick={this.handleNameSubmit} />
                        </Button>
                        {!this.state.errorMessage &&
                            <div className="formInline">
                                {this.state.loading ? 'Loading...' : 'You entered: ' + this.state.pokemonName}
                                {this.state.pokemonImage ? <img src={this.state.pokemonImage.front_default} alt='Not found' /> : ''}

                            </div>
                        }
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            Strengths
                            {!this.state.offense ?
                                <ToggleOnIcon sx={{ color: 'red', fontSize: 40 }} onClick={this.handleToggleOffense} /> :
                                <ToggleOffIcon sx={{ color: 'green', fontSize: 40 }} onClick={this.handleToggleOffense} />}
                            Weaknesses
                        </div>
                    </Grid>
                    <Grid item xs={9}>
                        <React.Fragment>
                            <TypeTable style={{ padding: '10px' }}
                                typeChart={this.typeChart}
                                damageCalcs={this.typingDamageCalcs}
                                typeOne={this.state.pokemonTypeOne}
                                typeTwo={this.state.pokemonTypeTwo}
                                offense={this.state.offense}
                            />
                        </React.Fragment>
                    </Grid>
                </Grid>
            </div >
        )
    }
}

export default PokeInfo;