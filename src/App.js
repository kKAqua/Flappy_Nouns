import styled from "styled-components";
import { useEffect, useState } from "react";

/**
 * All the constant values required for the game to work.
 * By changing these values we can effect the working of the game.
 */
const BIRD_HEIGHT = 28;
const BIRD_WIDTH = 33;
const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;
const GRAVITY = 4;
const OBJ_WIDTH = 52;
const OBJ_SPEED = 5;
const OBJ_GAP = 200;

/**
 * This function is the main component which renders all the game objects.
 * @returns None
 */
function App() {

  //Changing the game values based on the activities done in the game.
  const [isStart, setIsStart] = useState(false);
  const [birdpos, setBirdpos] = useState(300);
  const [objHeight, setObjHeight] = useState(0);
  const [objPos, setObjPos] = useState(WALL_WIDTH);
  const [score, setScore] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAscending, setIsAscending] = useState(false);

  // Function to handle wallet connection
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  //End the game when the player hits the bottom of the screen.
  useEffect(() => {
    let intVal;
    if (isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
      intVal = setInterval(() => {
        setBirdpos((birdpos) => birdpos + GRAVITY);
      }, 24);
    } else if (birdpos >= WALL_HEIGHT - BIRD_HEIGHT) {
      setIsStart(false);
      setIsGameOver(true);
    }
    return () => clearInterval(intVal);
  }, [isStart, birdpos]);

  //Generating the pipes(obstacles) for the game.
  useEffect(() => {
    let objval;
    if (isStart && objPos >= -OBJ_WIDTH) {
      objval = setInterval(() => {
        setObjPos((objPos) => objPos - OBJ_SPEED);
      }, 24);

      return () => {
        clearInterval(objval);
      };
    } else {
      setObjPos(WALL_WIDTH);
      setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
      if (isStart) setScore((score) => score + 1);
    }
  }, [isStart, objPos]);

  //Ends the game if the player hits one of the obstacles.
  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < objHeight;
    let bottomObj =
      birdpos <= WALL_HEIGHT &&
      birdpos >=
      WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;

    if (
      objPos >= OBJ_WIDTH &&
      objPos <= OBJ_WIDTH + 80 &&
      (topObj || bottomObj)
    ) {
      setIsStart(false);
      setIsGameOver(true);
    }
  }, [isStart, birdpos, objHeight, objPos]);

  //Handles the player movements.
  useEffect(() => {
    let ascendInterval;
    let velocity = -10;
    if (isAscending && isStart && !isGameOver) {
      ascendInterval = setInterval(() => {
        setBirdpos((prev) => {
          if (prev + velocity <= 0) {
            clearInterval(ascendInterval);
            return 0;
          }
          return prev + velocity;
        });
      }, 24);
    }
    else if (!isAscending && isStart && !isGameOver) {
      ascendInterval = setInterval(() => {
        setBirdpos((prev) => {
          if (prev + velocity <= 0) {
            clearInterval(ascendInterval);
            return 0;
          }
          velocity += 1;
          return velocity < 0 ? (prev + velocity) : prev;
        });
      }, 24);
    }
    return () => clearInterval(ascendInterval);
  }, [isAscending, isStart, isGameOver]);

  const handleMouseDown = () => {
    if (!isStart && isLoggedIn) {
      setIsStart(true);
    } else if (isStart && !isGameOver) {
      setIsAscending(true);
    }
  };

  const handleMouseUp = () => {
    setIsAscending(false);
  };

  const handleKeyDown = (event) => {
    if (event.code === 'Space') {
      handleMouseDown();
    }
  };

  const handleKeyUp = (event) => {
    if (event.code === 'Space') {
      handleMouseUp();
    }
  };

  return (
    <Home onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex="0">
      {!isLoggedIn ? (
        <LoginContainer height={WALL_HEIGHT} width={WALL_WIDTH}>
          <button onClick={connectWallet}>Connect Wallet</button>
          {!isLoggedIn && <Startboard>Click To Start</Startboard>}
        </LoginContainer>
      ) : (isLoggedIn && !isStart && !isGameOver) ? (
        <AddressContainer height={WALL_HEIGHT} width={WALL_WIDTH}>
          <h2>Click To Start!</h2>
          <Startboard>Click To Start</Startboard>
        </AddressContainer>
      ) : isGameOver ? (
        <GameOverContainer height={WALL_HEIGHT} width={WALL_WIDTH}>
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <button onClick={() => { setIsGameOver(false); setIsStart(false); setScore(0); setBirdpos(300); }}>Restart</button>
        </GameOverContainer>
      ) : (
        <>
          <ScoreShow>Score: {score}</ScoreShow>
          <Background height={WALL_HEIGHT} width={WALL_WIDTH}>
            <Obj
              height={objHeight}
              width={OBJ_WIDTH}
              left={objPos}
              top={0}
              deg={180}
            />
            <Bird
              height={BIRD_HEIGHT}
              width={BIRD_WIDTH}
              top={birdpos}
              left={100}
            />
            <Obj
              height={WALL_HEIGHT - OBJ_GAP - objHeight}
              width={OBJ_WIDTH}
              left={objPos}
              top={WALL_HEIGHT - (objHeight + (WALL_HEIGHT - OBJ_GAP - objHeight))}
              deg={0}
            />
          </Background>
        </>
      )}
    </Home>
  );
}

export default App;

//All the stylesheets required for the game.
const Home = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flexDirection: 'column';
`;

const Background = styled.div`
  background-image: url("./images/background-day.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;
  overflow: hidden;
  border: 2px solid black;
`;

const Bird = styled.div`
  position: absolute;
  background-image: url("./images/yellowbird-upflap.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const Obj = styled.div`
  position: relative;
  background-image: url("./images/pipe-green.png");
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  transform: rotate(${(props) => props.deg}deg);
`;

const Startboard = styled.div`
  position: relative;
  top: 49%;
  background-color: black;
  padding: 10px;
  width: 100px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  font-size: 20px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
`;

const ScoreShow = styled.div`
  position: absolute;
  top: 10%;
  left: 47%;
  z-index: 1;
  font-weight: bold;
  font-size: 30px;
`;

const LoginContainer = styled(Background)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 20px;
  color: white;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  button {
    padding: 15px 30px;
    font-size: 18px;
    background-color: #007bff;
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  button:hover {
    background-color: #0056b3;
  }
`;

const AddressContainer = styled(Background)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 20px;
  color: white;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  background-color: rgba(0, 0, 0, 0.7);
  h2 {
    font-size: 40px;
    margin-bottom: 25px;
    color: #f0db4f;
  }
  p {
    font-size: 22px;
    margin-bottom: 25px;
    color: #ffffff;
  }
  button {
    padding: 15px 30px;
    font-size: 18px;
    background-color: #ff4500;
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  button:hover {
    background-color: #e03e00;
  }
`

const GameOverContainer = styled(Background)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 20px;
  color: white;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  h2 {
    font-size: 36px;
    margin-bottom: 20px;
  }
  p {
    font-size: 24px;
    margin-bottom: 20px;
  }
  button {
    padding: 15px 30px;
    font-size: 18px;
    background-color: #28a745;
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  button:hover {
    background-color: #218838;
  }
`;
