import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import TypeTable from './TypeTable';
import damageCalculator from './DamageCalculator';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { typeImages } from '../data/types';

class PokeInfo extends React.Component {
    constructor() {
        super();
        this.typeInfoRef = React.createRef();
        this.state = {
            userPokemon: 'pikachu',
            editingUserPokemon: '',
            offense: true, // true = strengths, false = weaknesses
            loading: true,
            pokemonName: null,
            pokemonImage: null,
            pokemonTypeOne: null,
            pokemonTypeTwo: null,
            pokemonId: null,
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
        if (response.status === 200) {
            const pokemonData = await response.json();
            this.setState({
                pokemonName: pokemonData.species.name,
                pokemonTypeOne: pokemonData.types[0],
                pokemonTypeTwo: (pokemonData.types[1] ? pokemonData.types[1] : null),
                pokemonImage: (pokemonData.sprites),
                pokemonId: pokemonData.id,
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
        if (newPokemon) {
            this.setState({ userPokemon: newPokemon, loading: true });
        }
        else {
            this.setState({
                errorMessage: "Need to enter a pokemon.",
            });
        }
    }

    handleToggleOffense = () => {
        this.setState({ offense: !this.state.offense, loading: true });
    }

    // Find the type image from a type name
    findTypeImage(typeName) {
        if (!typeName) return null;
        
        let typeImage = null;
        typeImages.forEach(image => {
            if (typeName.includes(image.name)) {
                typeImage = image.image;
            }
        });
        
        return typeImage;
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    formatPokemonId(id) {
        return id < 10 ? `#00${id}` : id < 100 ? `#0${id}` : `#${id}`;
    }

    render() {
        return (
            <div className="poke-container">
                <Paper className="app-header" elevation={3}>
                    <Typography variant="h2">Pokémon Type Chart</Typography>
                    <Typography variant="body1">Enter a pokemon below to see its typing, and a type chart of its effectiveness against other types.</Typography>
                    <Typography variant="body2">If a pokemon isn't being found by name, try by dex number instead.</Typography>
                    {this.state.errorMessage && (
                        <Typography className="error-message">{this.state.errorMessage}</Typography>
                    )}
                </Paper>

                <Grid container spacing={3} direction='row' justifyContent="center" alignItems='flex-start'>
                    <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Paper elevation={2} className="formInline" style={{ width: '100%', maxWidth: '400px' }}>
                            <div className="search-section">
                                <TextField 
                                    className="userInput"
                                    variant='outlined'
                                    placeholder="Enter Pokémon name"
                                    value={this.state.editingUserPokemon}
                                    onChange={this.handleNameChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            this.handleNameSubmit(e);
                                        }
                                    }}
                                    fullWidth
                                />
                                <Button 
                                    color="primary" 
                                    variant="contained"
                                    onClick={this.handleNameSubmit}
                                >
                                    <SearchIcon />
                                </Button>
                            </div>

                            {this.state.loading ? (
                                <div className="loading-indicator">
                                    <div className="loading-spinner"></div>
                                </div>
                            ) : !this.state.errorMessage && this.state.pokemonName ? (
                                <div className="pokemon-card">
                                    <h2 className="pokemon-name">{this.capitalize(this.state.pokemonName)}</h2>
                                    <p className="pokemon-dex-number">
                                        <i>Pokédex {this.formatPokemonId(this.state.pokemonId)}</i>
                                    </p>
                                    
                                    <div className="pokemon-image-container">
                                        {this.state.pokemonImage && (
                                            <img 
                                                src={this.state.pokemonImage.other?.['official-artwork']?.front_default || this.state.pokemonImage.front_default} 
                                                alt={this.state.pokemonName}
                                            />
                                        )}
                                    </div>
                                    
                                    <div className="type-badges">
                                        {this.state.pokemonTypeOne && (
                                            <img 
                                                className="type-badge-icon"
                                                src={this.findTypeImage(this.state.pokemonTypeOne.type.name)} 
                                                alt={this.state.pokemonTypeOne.type.name}
                                                title={this.capitalize(this.state.pokemonTypeOne.type.name)}
                                            />
                                        )}
                                        {this.state.pokemonTypeTwo && (
                                            <img 
                                                className="type-badge-icon"
                                                src={this.findTypeImage(this.state.pokemonTypeTwo.type.name)} 
                                                alt={this.state.pokemonTypeTwo.type.name}
                                                title={this.capitalize(this.state.pokemonTypeTwo.type.name)}
                                            />
                                        )}
                                    </div>
                                    
                                    <div className="toggle-container">
                                        <span className={`toggle-label ${!this.state.offense ? 'active' : ''}`}>
                                            Weaknesses
                                        </span>
                                        
                                        {this.state.offense ? (
                                            <ToggleOnIcon 
                                                style={{ color: '#4caf50', fontSize: 40 }} 
                                                onClick={this.handleToggleOffense} 
                                            />
                                        ) : (
                                            <ToggleOffIcon 
                                                style={{ color: '#f44336', fontSize: 40 }} 
                                                onClick={this.handleToggleOffense} 
                                            />
                                        )}
                                        
                                        <span className={`toggle-label ${this.state.offense ? 'active' : ''}`}>
                                            Strengths
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={8}>
                        {!this.state.errorMessage && (
                            <TypeTable 
                                typeChart={this.typeChart}
                                damageCalcs={this.typingDamageCalcs}
                                typeOne={this.state.pokemonTypeOne}
                                typeTwo={this.state.pokemonTypeTwo}
                                offense={this.state.offense}
                                error={this.state.errorMessage}
                            />
                        )}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default PokeInfo;