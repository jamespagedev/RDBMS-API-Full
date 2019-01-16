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
// /api/students (get multi)
router.get('/', (req, res) => {
  db('students')
    .then(students => {
      res.status(200).json(students);
    })
    .catch(err => res.status(500).json(err));
});

// /api/students/:id (get single)
router.get('/:id', (req, res) => {
  db('students')
    .where({ id: req.params.id })
    .then(student => {
      if (student.length !== 0) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ error: 'student not found' });
      }
    })
    .catch(err => res.status(500).json(err));
});

// /api/students (create)
router.post('/', (req, res) => {
  const cohort_id = req.body.cohort_id;
  db('cohorts')
    .where({ id: cohort_id })
    .then(cohort => {
      if (cohort.length !== 0) {
        db('students')
          .insert(req.body)
          .then(ids => {
            res.status(201).json(ids);
          })
          .catch(err => res.status(500).json(err));
      } else {
        res.status(404).json({ error: `cohort_id '${cohort_id}' not found` });
      }
    })
    .catch(err => res.status(500).json(err));
});

// /api/students/:id (delete)
router.delete('/:id', (req, res) => {
  db('students')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res
          .status(404)
          .json({ error: `student with ID '${req.params.id}' not found` });
      }
    })
    .catch(err => res.status(500).json(err));
});

// /api/students/:id (edit)
router.put('/:id', (req, res) => {
  const changes = req.body;
  db('cohorts')
    .where({ id: changes.cohort_id })
    .then(cohort => {
      if (cohort.length !== 0) {
        db('students')
          .where({ id: req.params.id })
          .update(changes)
          .then(count => {
            if (count) {
              res.status(200).json(count);
            } else {
              res
                .status(404)
                .json({
                  error: `student with ID '${req.params.id}' not found`
                });
            }
          })
          .catch(err => res.status(500).json(err));
      } else {
        res
          .status(404)
          .json({ error: `cohort_id '${changes.cohort_id}' not found` });
      }
    })
    .catch(err => res.status(500).json(err));
});

/***************************************************************************************************
 ********************************************* export(s) *******************************************
 **************************************************************************************************/
module.exports = router;
