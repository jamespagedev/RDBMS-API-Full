/***************************************************************************************************
 ******************************************* dependencies ******************************************
 **************************************************************************************************/
const express = require('express');
const db = require('../../data/dbConfig.js');

const router = express.Router();

/***************************************************************************************************
 ******************************************** middleware *******************************************
 **************************************************************************************************/
// None

/***************************************************************************************************
 ********************************************** routes *********************************************
 **************************************************************************************************/
// /api/cohorts (get multi)
router.get('/', (req, res) => {
  db('cohorts')
    .then(cohorts => {
      res.status(200).json(cohorts);
    })
    .catch(err => res.status(500).json(err));
});

// /api/cohorts/:id (get single)
router.get('/:id', (req, res) => {
  db('cohorts')
    .where({ id: req.params.id })
    .then(cohort => {
      if (cohort.length !== 0) {
        res.status(200).json(cohort);
      } else {
        res.status(404).json({ error: 'cohort not found' });
      }
    })
    .catch(err => res.status(500).json(err));
});

// /api/cohorts/:id/students (get all students belonging to cohort)
router.get('/:id/students', (req, res) => {
  db('students')
    .where({ cohort_id: req.params.id })
    .then(students => res.status(200).json(students))
    .catch(err => res.status(500).json(err));
});

// /api/cohorts (create)
router.post('/', (req, res) => {
  // db.insert(req.body).into('cohorts').then().catch();
  // or
  db('cohorts')
    .insert(req.body)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.status(500).json(err));
});

// /api/cohorts/:id (delete)
router.delete('/:id', (req, res) => {
  db('cohorts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res
          .status(404)
          .json({ error: `cohort with ID '${req.params.id}' not found` });
      }
    })
    .catch(err => res.status(500).json(err));
});

// /api/cohorts/:id (edit)
router.put('/:id', (req, res) => {
  const changes = req.body;

  db('cohorts')
    .where({ id: req.params.id })
    .update(changes)
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res
          .status(404)
          .json({ error: `cohort with ID '${req.params.id}' not found` });
      }
    })
    .catch(err => res.status(500).json(err));
});

/***************************************************************************************************
 ********************************************* export(s) *******************************************
 **************************************************************************************************/
module.exports = router;
