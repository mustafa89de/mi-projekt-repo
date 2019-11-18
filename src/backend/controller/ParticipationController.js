const JWTService = require("../services/JWTService");
const ParticipationRepository = require('../repositories/ParticipationRepository');

const express = require('express');
const router = express.Router();

router.post('/', JWTService.requireJWT(), async (req, res) => {
  try {
    const {userId, eventId} = req.query;
    const participation = await ParticipationRepository.attendEvent(userId, eventId);

    if(participation === null){
      res.status(404).json({message: `Event with id "${eventId}" 
      or User with with id "${userId}" does not exist or User is already participant.`});
    }

    res.status(201).json();
  } catch (err) {
    console.log(err.status);
    res.status(500).json({message: err.message})
  }
});

router.delete('/', JWTService.requireJWT(), async (req, res) => {
  try {
    const {userId, eventId} = req.query;
    const removal = await ParticipationRepository.cancelAttendance(userId, eventId);
    if (!removal){
      res.status(404).json({message: `Deletion of participation with userId: ${userId} and eventId: ${eventId} unsuccessful`})
    }
    res.json();
  } catch (err) {
    console.log(err.status);
    res.status(500).json({message: err.message})
  }
});

router.get('/:uid', JWTService.requireJWT(), async (req, res) => {
  try {
    const userId = req.user.id;
    const participations = await ParticipationRepository.getUserParticipations(userId);
    res.json(participations);
  } catch (err) {
    console.log(err.status);
    res.status(500).json({message: err.message})
  }
});

module.exports = router;