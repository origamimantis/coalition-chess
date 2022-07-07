
let globals = {}

export const getVar = (s) => {return globals[s]}
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
