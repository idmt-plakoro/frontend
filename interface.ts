enum Direction {
  Upright = 'Upright',
  FaceUp = 'FaceUp',
  UpsideDown = 'UpsideDown',
  FaceDown = 'FaceDown',
  LeftSide = 'LeftSide',
  RightSide = 'RightSide'
}

export interface PokemonSet {
    id: number,
    enPokemonName: string,
    thPokemonName: string,
    hp: number,
    typeId: number,
    weaknessTypeId: number,
    enDescription: string,
    thDescription: string,
    pokemonImage: string
}

interface pokemonData {

}

interface energyCost {
    typeId: number,
    quantity: number
}

interface effect {
    abitlity: {
        en: string,
        th: string
    }
    directions: Direction[],
}

interface SkillCard {
    id: number,
    typeId: number,
    damage: number,
    name: {
        en: string,
        th: string
    }
    energyCosts: energyCost[],
    effects: effect[]
}

export interface PokemonFullSet {
    id: number,
    hp: number,
    typeId: number,
    weaknessTypeId: number,
    pokemonImage: string
    name: {
        en: string,
        th: string
    },
    description: {
        en: string,
        th: string
    }
    skillCards: SkillCard[] 
}

export interface ApiResponse<T> {
  data: T;
}