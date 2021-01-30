import React, { useState, useRef, useCallback } from 'react'; 
import produce from 'immer';

const operations = [
  [0,1],
  [0,-1],
  [1,-1],
  [-1,1],
  [1,1],
  [-1,-1],
  [1,0],
  [-1,0]
];

const generateEmptyGrid = () => {
  const rows = []; 
  for (var i = 0; i < 50; i++) {
    rows.push(Array.from(Array(50), ()=> 0 ))
  }
  return rows
}

function App() {

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;
  const runSimulation = useCallback(() => {
      if (!runningRef.current) {
        return;
      }
      setGrid((g)=>{
        return produce(g, gridCopy =>{
          for(let i =0; i < 50; i++){
            for (let k = 0; k < 50; k++){
              let neighbors = 0;
              operations.forEach(([x,y])=>{
                const newI = i + x;
                const newK = k + y;
                if(newI >= 0 && newI <50 && newK >= 0 && newK < 50){
                  neighbors += g[newI][newK];
                }
              })
              if (neighbors < 2 || neighbors > 3){
                gridCopy[i][k] = 0;
              } else if (g[i][k] === 0 && neighbors === 3){
                gridCopy[i][k] = 1;
              }
            }
          }
        })
      });
      setTimeout(runSimulation, 50);
    },[]);

  return (
    <>
      <button onClick = {() => {setGrid(generateEmptyGrid())} }>Clear</button>
      <button onClick = {() => {setRunning(!runningRef.current);
        if (!runningRef.current) {
          console.log(runningRef.current === running)
          runningRef.current = true; 
          runSimulation()} }}>{ running ? 'Stop' : 'Run'}</button> 
      <div 
          style={{
            display:"grid",
            gridTemplateColumns: `repeat(${50}, 20px)`
          }}
        >
          {grid.map((rows, i) => 
            rows.map((col, k) => (
              <div 
              key = {`${i}-${k}`}
              onClick={()=>{
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                })
                setGrid(newGrid);
              }}
                style={{
                  width: 20, 
                  height:20, 
                  backgroundColor: grid[i][k] ? "blue":undefined, 
                  border:"solid 1px black"
                }}
              />
            ))
          )}
        </div>
      </>
  );
}

export default App;
