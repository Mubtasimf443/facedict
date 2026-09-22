/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */


import { interestCategories } from "../../data/interestCategories";
import shuffleArray from "./shuffleArray";


export function getInterestCategory(selectedInterest: string): string | null {
    for (const [category, interests] of Object.entries(interestCategories)) {
        if (interests.includes(selectedInterest)) {
            return category;
        }
    }

    return null;
}

export function getInterestSuggestion(array: string[]) {
    let suggestedInterest: string[] = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        let category= getInterestCategory(element);
        if (category === null) {
            continue;
        }
        let unfilteredSuggestedInterest= interestCategories[category];
        suggestedInterest.push(shuffleArray(unfilteredSuggestedInterest)[0])
    }
    return suggestedInterest;
}