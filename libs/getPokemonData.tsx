import { ApiResponse, PokemonFullSet } from "../interface";

export default async function getPokemonData(pokemonId: number): Promise<ApiResponse<PokemonFullSet>> {

    const response = await fetch(`${process.env.BACKEND_URL}/api/pokemon/${pokemonId}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }
    
    return data;

}