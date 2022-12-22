import { useState, useEffect, useRef } from 'react';
import { useTransition, animated } from 'react-spring';
import shuffle from 'lodash/shuffle';
import Confetti from 'react-confetti';
import { useNavigate } from "react-router-dom";
// import data from '../data';
import "./Raffle.css";
import ClientsAdminPage from "../components/ClientsAdminPage";
import HeadingImage from '../images/heading.svg';
import Play from '../images/play.svg';
import Reshuffle from '../images/reshuffle.svg';
import Replay from '../images/replay.svg';
import { useJoinraffleMutation } from '../services/appApi';
import { Table } from "react-bootstrap";
import axios from "../axios";

function JoinRaffle() {
  // const [names, setNames] = useState(users);
  const initialText = 'Join Raffle!';
  const [buttonText, setButtonText] = useState(initialText);
  const [initialLoad, setInitialLoad] = useState(false);
  const [windowHeight, setWindowHeight] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wraffling, setWraffling] = useState(false);
  const confettiWrapper = useRef(null);
  const [isJoin, setJoin] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const height = 60;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinraffle, { isError, error, isLoading, isSuccess }] = useJoinraffleMutation();
  useEffect(() => {
    axios
        .get("/users/")
        .then(({ data }) => {
            const user = data.user;
            setName(user.name);
            setJoin(user.isJoin);
        })
        .catch((e) => console.log(e));
}, []);
  const transitions = useTransition(
    users.map((data) => ({ ...data, y: 0.5 })),
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
  

  function restartRaffle() {
    setInitialLoad(false);
    // setUser(data);
    setWraffling(false);
    setShowConfetti(false);
  }
 
  useEffect(() => {
      setLoading(true);
      axios
          .get("/users")
          .then(({ data }) => {
              setLoading(false);
              setUsers(data);
              setJoin("join");
          })
          .catch((e) => {
              setLoading(false);
              console.log(e);
          });
  }, []);

  
  useEffect(() => {
    if (initialLoad) {
      const filteringTimer = setTimeout(() => {
        joinraffle();
      }, 700);
      return () => {
        clearTimeout(filteringTimer);
      };
    }
  }, [initialLoad, users, JoinRaffle]);

  useEffect(() => {
    setWindowHeight(confettiWrapper.current.clientHeight);
    setWindowWidth(confettiWrapper.current.clientWidth);
  }, []);
  function handleJoin(e) {
    e.preventDefault();
    setButtonText('Letsgo!');
    joinraffle({ isJoin : "hai"}).then(({ data }) => {
        if (data.length > 0) {
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    });
}
  return (
    <div className="container" ref={confettiWrapper}>
      <div className="raffle-header">
        <img className="banner-image" src={HeadingImage} alt="heading logo" />
        {!initialLoad && (
          <div className="raffle-header__buttons">
            <h1>Participants</h1>
        
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
      
    </div>
  );
}

export default JoinRaffle;