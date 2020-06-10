import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import TypeInfo from './TypeInfo';

class PokeInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            userPokemon: 'pikachu',
            editingUserPokemon: '',
            loading: true,
            pokemonName: null,
            pokemonImage: null,
            pokemonTypeOne: null,
            pokemonTypeTwo: null,
        };
    }

    async componentDidMount() {
        this.gettingApiData();
    }

    componentDidUpdate() {
        if (this.state.loading) {
            this.gettingApiData();
        }
    }

    async gettingApiData() {
        const url = 'https://pokeapi.co/api/v2/pokemon/' + this.state.userPokemon + '/';
        const response = await fetch(url);
        const data = await response.json();
        this.setState({
            pokemonName: data.species.name,
            pokemonTypeOne: data.types[0],
            pokemonTypeTwo: (data.types[1] ? data.types[1] : null),
            pokemonImage: (data.sprites),
            loading: false,
        });
    }

    handleNameChange = (event) => {
        let newValue = event.target.value;
        this.setState({ editingUserPokemon: newValue });
    }

    handleNameSubmit = () => {
        let newPokemon = this.state.editingUserPokemon;
        this.setState({ userPokemon: newPokemon, loading: true });
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
                    <Button onClick={this.handleNameSubmit}>Submit</Button>
                </Grid>

                <div className="formInline">
                    {this.state.loading ? 'Loading...' : 'You entered: ' + this.state.pokemonName + '. ' +
                        typeOne.type.name + (typeTwo ? ', ' + typeTwo.type.name : '')}
                    {this.state.pokemonImage ? <img src={this.state.pokemonImage.front_default} alt='Not found' /> : ''}
                </div>
                <TypeInfo style={{ padding: '10px' }}
                    typeOne={typeOne ? typeOne.type.name : null}
                    typeTwo={typeTwo ? typeTwo.type.name : null}
                    loading={true}
                />

            </div>
        )
    }
}

export default PokeInfo;