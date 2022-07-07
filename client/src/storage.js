
let globals = {}

export const getVar = (s) => {if (s !== undefined) return globals[s]; else return globals}
export const setVar = (s, v) => {globals[s] =  v}

export function stateSetter(state)
{
  let d = {}
  d.update = () =>
  {
    state[1](!state[0])
  }
  return d
}
