import { PokemonSet } from "../interface";

export default async function getPokemonList(): Promise<PokemonSet[]> {

    const response = await fetch(`${process.env.BACKEND_URL}/api/pokemon/list`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }
    
    return data;

}