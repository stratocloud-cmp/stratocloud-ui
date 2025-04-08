import {inject, provide} from 'vue'

class SequenceGenerator {
    sequenceSet = new Set()

    getSequence(prefix) {
        for (let i = 1; i <= 1000; i++) {
            let s = prefix + i
            if(!this.sequenceSet.has(s)) {
                this.sequenceSet.add(s)
                return s
            }
        }
        console.error("Failed to generate sequence, tried 1000 but all conflicted, fallback to "+prefix)
        return prefix
    }

    addSequence(s){
        this.sequenceSet.add(s)
    }
}

export function useSequenceGeneratorProvider(){
    const sequenceGenerator = new SequenceGenerator()
    provide('sequenceGenerator', sequenceGenerator)
    return sequenceGenerator
}

export function useSequenceGenerator(){
    return inject('sequenceGenerator', new SequenceGenerator())
}