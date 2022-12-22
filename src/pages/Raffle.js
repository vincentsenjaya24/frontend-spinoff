import { useState, useEffect, useRef } from 'react';
import { useTransition, animated } from 'react-spring';
import shuffle from 'lodash/shuffle';
import Confetti from 'react-confetti';

import data from '../data';
import "./Raffle.css";
import HeadingImage from '../images/heading.svg';
import Play from '../images/play.svg';
import Reshuffle from '../images/reshuffle.svg';
import Replay from '../images/replay.svg';
import axios from "../axios";
function Raffle() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState(data);
  const [initialLoad, setInitialLoad] = useState(false);
  const [windowHeight, setWindowHeight] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wraffling, setWraffling] = useState(false);
  const confettiWrapper = useRef(null);
  const height = 60;
  useEffect(() => {
    setLoading(true);
    axios
        .get("/users")
        .then(({ data }) => {
            setLoading(false);
            setUsers(data);
        })
        .catch((e) => {
            setLoading(false);
            console.log(e);
        });
}, []);

  const transitions = useTransition(
    users.map((data, i) => ({ ...data, y: 0.5 * i })),
    (d) => d.name,
    {
      from: { position: 'initial', opacity: 0 },
      leave: {
        height: height - (height * 0.2),
        opacity: 0,
      },
      enter: ({ y }) => ({ y, opacity: 1 }),
      update: ({ y }) => ({ y }),
    }
  );

  function startRaffle() {
    if (users.length <= 1) {
      setWraffling(true);
      setShowConfetti(true);
      return;
    }
    const randomIndex = Math.floor(Math.random() * users.length);
    const filterOutNames = users.filter((name) => name !== users[randomIndex]);
    setUsers(filterOutNames);
    setInitialLoad(true);
  }

  function restartRaffle() {
    setInitialLoad(false);
    setNames(data);
    setWraffling(false);
    setShowConfetti(false);
  }

  useEffect(() => {
    if (initialLoad) {
      const filteringTimer = setTimeout(() => {
        startRaffle();
      }, 700);
      return () => {
        clearTimeout(filteringTimer);
      };
    }
  }, [initialLoad, users, startRaffle]);

  useEffect(() => {
    setWindowHeight(confettiWrapper.current.clientHeight);
    setWindowWidth(confettiWrapper.current.clientWidth);
  }, []);

  return (
    <div className="container" ref={confettiWrapper}>
      <div className="raffle-header">
        <img className="banner-image" src={HeadingImage} alt="heading logo" />
        {!initialLoad && (
          <div className="raffle-header__buttons">
            <button className="button-primary" onClick={startRaffle}>
              <img src={Play} alt="heading logo" />
              Start Raffle
            </button>
            <button
              className="button-outline"
              onClick={() => setNames(shuffle(names))}
            >
              <img src={Reshuffle} alt="heading logo" />
              Shuffle
            </button>
          </div>
        )}
      </div>
      {wraffling && (
        <Confetti
          recycle={showConfetti}
          numberOfPieces={80}
          width={windowWidth}
          height={windowHeight}
        />
      )}
      <div className="raffle-names">
        {transitions.map(({ item, props: { y, ...rest }, index }) => (
          <animated.div
            className="raffle-listnames"
            key={index}
            style={{
              transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
              ...rest
            }}
          >
            <div className="raffle-namelist">
              <span>{item.name}</span>
            </div>
          </animated.div>
        ))}
      </div>
      <div>
        {showConfetti && (
          <div className="raffle-ends">
            <h3>Congratulations! You have won the raffle!</h3>
            <button className="button-outline" onClick={restartRaffle}>
              <img src={Replay} alt="heading logo" />
              Replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Raffle;