const assert = require('chai').assert;
const app = require('../server.js');
const request = require('request');
const Food = require('../lib/models/food');
const food = new Food

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

function truncate (done) {
  database.raw('TRUNCATE foods RESTART IDENTITY CASCADE').then(() => {
    return database.raw('TRUNCATE categories RESTART IDENTITY CASCADE');
  }).then(() => {
    return database.raw('TRUNCATE meals RESTART IDENTITY CASCADE');
  }).then(() => {
    done();
  }).catch(done);
}

describe('Server', () => {
  before(done => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, result) => {
      if (err) {
        return done(err);
      }
      done();
    })

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    })
  })

  after( () => {
    this.server.close();
  })

  describe('/api/meals', () => {
    afterEach(truncate)

    describe('GET /api/meals/breakfast/<date>', () => {
      beforeEach((done) => {
        food.create('burrito', 400)
        .then((data) => {
          this.food = data.rows[0];
          return database.raw(
            'INSERT INTO categories (name, created_at) VALUES (?, ?) RETURNING *',
            ['breakfast', new Date])
        }).then((data) => {
          this.category = data.rows[0];
          return database.raw(
            'INSERT INTO meals (food_id, category_id, date, created_at) VALUES (?, ?, ?, ?)',
            [this.food.id, this.category.id, '2017/5/1', new Date])
        }).then(() => {
          done();
        }).catch(done)
      })


      it('should return 200', (done) => {
        this.request.get(`/api/meals/breakfast/2017/5/1`, (err, res) => {
          assert.equal(res.statusCode, 200);

          const parsedData = JSON.parse(res.body);

          assert.equal(parsedData.length, 1)
          assert.equal(parsedData[0].food_id, this.food.id)
          assert.equal(parsedData[0].category_id, this.category.id)
          assert.equal(parsedData[0].food_name, 'burrito')
          assert.equal(parsedData[0].calories, 400)
          assert.equal(parsedData[0].category_name, 'breakfast')
          done();
        })
      })

      it('returns an empty array if there is no breakfast for that day', (done) =>{
        this.request.get(`/api/meals/breakfast/2001/02/20`, (err, res) => {
          assert.equal(res.statusCode, 200);

          const parsedData = JSON.parse(res.body);

          assert.equal(parsedData.length, 0)
          assert.deepEqual(parsedData, [])
          done();
        })
      })
    })

    describe('GET /api/meals/lunch/<date>', () => {
      beforeEach((done) => {
        food.create('taco', 250)
        .then((data) => {
          this.food = data.rows[0];
          return database.raw(
            'INSERT INTO categories (name, created_at) VALUES (?, ?) RETURNING *',
            ['lunch', new Date])
        }).then((data) => {
          this.category = data.rows[0];
          return database.raw(
            'INSERT INTO meals (food_id, category_id, date, created_at) VALUES (?, ?, ?, ?)',
            [this.food.id, this.category.id, '2015/11/15', new Date])
        }).then(() => {
          done();
        }).catch(done)
      })

      it('should return the meal data', (done) => {
        this.request.get(`/api/meals/lunch/2015/11/15`, (err, res) => {
          assert.equal(res.statusCode, 200);

          const parsedData = JSON.parse(res.body);

          assert.equal(parsedData.length, 1)
          assert.equal(parsedData[0].food_id, this.food.id)
          assert.equal(parsedData[0].category_id, this.category.id)
          assert.equal(parsedData[0].food_name, 'taco')
          assert.equal(parsedData[0].calories, 250)
          assert.equal(parsedData[0].category_name, 'lunch')
          done();
        })
      })

      it('returns an empty array if there is no snack for that day', (done) =>{
        this.request.get(`/api/meals/lunch/2001/2/20`, (err, res) => {
          assert.equal(res.statusCode, 200);

          const parsedData = JSON.parse(res.body);

          assert.equal(parsedData.length, 0)
          assert.deepEqual(parsedData, [])
          done();
        })
      })
    })

    describe('GET /api/meals/dinner/<date>', () => {
      beforeEach((done) => {
        food.create('calzone', 2500)
        .then((data) => {
          this.food = data.rows[0];
          return database.raw(
            'INSERT INTO categories (name, created_at) VALUES (?, ?) RETURNING *',
            ['dinner', new Date])
        }).then((data) => {
          this.category = data.rows[0];
          return database.raw(
            'INSERT INTO meals (food_id, category_id, date, created_at) VALUES (?, ?, ?, ?)',
            [this.food.id, this.category.id, '2017/2/2', new Date])
        }).then(() => {
          done();
        }).catch(done)
      })

      it('should return the meal data', (done) => {
        this.request.get(`/api/meals/dinner/2017/2/02`, (err, res) => {
          assert.equal(res.statusCode, 200);

          const parsedData = JSON.parse(res.body);

          assert.equal(parsedData.length, 1)
          assert.equal(parsedData[0].food_id, this.food.id)
          assert.equal(parsedData[0].category_id, this.category.id)
          assert.equal(parsedData[0].food_name, 'calzone')
          assert.equal(parsedData[0].calories, 2500)
          assert.equal(parsedData[0].category_name, 'dinner')
          done();
        })
      })

      it('returns an empty array if there is no dinner for that day', (done) =>{
        this.request.get(`/api/meals/dinner/2001/2/20`, (err, res) => {
          assert.equal(res.statusCode, 200);

          const parsedData = JSON.parse(res.body);

          assert.equal(parsedData.length, 0)
          assert.deepEqual(parsedData, [])
          done();
        })
      })
    })

    describe('GET /api/meals/snacks/<date>', () => {
      beforeEach((done) => {
        food.create('popcorn', 10)
        .then((data) => {
          this.food = data.rows[0];
          return database.raw(
            'INSERT INTO categories (name, created_at) VALUES (?, ?) RETURNING *',
            ['snacks', new Date])
        }).then((data) => {
          this.category = data.rows[0];
          return database.raw(
            'INSERT INTO meals (food_id, category_id, date, created_at) VALUES (?, ?, ?, ?) RETURNING *',
            [this.food.id, this.category.id, '2001/12/20', new Date])
        }).then((data) => {
          done();
        }).catch(done)
      })

      it('should return the meal data', (done) => {
        this.request.get(`/api/meals/snacks/2001/12/20`, (err, res) => {
          assert.equal(res.statusCode, 200);

          const parsedData = JSON.parse(res.body);

          assert.equal(parsedData.length, 1)
          assert.equal(parsedData[0].food_id, this.food.id)
          assert.equal(parsedData[0].category_id, this.category.id)
          assert.equal(parsedData[0].food_name, 'popcorn')
          assert.equal(parsedData[0].calories, 10)
          assert.equal(parsedData[0].category_name, 'snacks')
          done();
        })
      })

      it('returns an empty array if there is no snack for that day', (done) =>{
        this.request.get(`/api/meals/snacks/2001/2/20`, (err, res) => {
          assert.equal(res.statusCode, 200);

          const parsedData = JSON.parse(res.body);

          assert.equal(parsedData.length, 0)
          assert.deepEqual(parsedData, [])
          done();
        })
      })
    })

    describe('DELETE /api/meals', () => {
      beforeEach((done) => {
        food.create('popcorn', 10)
        .then((data) => {
          this.food = data.rows[0];
          return database.raw(
            'INSERT INTO categories (name, created_at) VALUES (?, ?) RETURNING *',
            ['snacks', new Date])
        }).then((data) => {
          this.category = data.rows[0];
          return database.raw(
            'INSERT INTO meals (food_id, category_id, date, created_at) VALUES (?, ?, ?, ?) RETURNING *',
            [this.food.id, this.category.id, '2001/12/20', new Date])
        }).then((data) => {
          this.id = data.rows[0].id
          done();
        }).catch(done)
      })

      afterEach(truncate)

      it('should return 200', (done) => {
        this.request.delete(`/api/meals/${this.id}`, (err, res) => {
          if (err) { return done(err) }

          assert.equal(200, res.statusCode);

          database.raw('SELECT * FROM meals WHERE id = ?', this.id)
            .then((data) => {
              assert.equal(data.rows.length, 0)
              done();
            })
        })
      })

  });


    describe('POST /api/meals', () => {
      beforeEach((done) => {
        food.create('paella', 2000)
        .then((data) => {
          this.foods = [data.rows[0]]
          return food.create('muffin', 900)
        }).then((data) => {
          this.foods.push(data.rows[0])
          return database.raw(
            'INSERT INTO categories (name, created_at) VALUES (?, ?) RETURNING *',
            ['breakfast', new Date])
        }).then((data) => {
          this.category = data.rows[0];
          done();
        })
      })

      afterEach(truncate)

      it('should return 200', (done) => {
        let meal = {
          foodIds: this.foods.map((food) => {
            return food.id
          }).join(','),
          category: 'breakfast',
          date: '2017/5/15'
        }

        this.request.post('api/meals', { form: {meal: meal} }, (err, res) => {
          if (err) { return done(err) }

          let parsedMeals = JSON.parse(res.body);
          let parsedDate = new Date(parsedMeals[0].date);

          assert.equal(res.statusCode, 200);
          assert.equal(parsedMeals.length, 2);
          assert.equal(parsedMeals[0].food_id, this.foods[0].id)
          assert.equal(parsedMeals[0].category, 'breakfast')
          assert.equal(parsedDate.getFullYear(), '2017')
          assert.equal(parsedDate.getMonth(), '4')
          assert.equal(parsedDate.getDate(), '15')

          done();
        })
      })
    })
  })
})
