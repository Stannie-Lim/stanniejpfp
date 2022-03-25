const express = require('express')
const path = require('path')
const Sequelize = require('sequelize');
const { faker } = require('@faker-js/faker');

const { STRING, DECIMAL, TEXT, VIRTUAL } = Sequelize.DataTypes;

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/jpfp');

const Campus = db.define('campus', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  imageUrl: {
    type: STRING,
    defaultValue: 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg',
    validate: {
      notEmpty: true,
    },
  },
  address: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  }
});

const Student = db.define('student', {
  firstName: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  lastName: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
  imageUrl: {
    type: STRING,
    defaultValue: 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg',
    validate: {
      notEmpty: true,
    },
  },
  gpa: {
    type: DECIMAL,
  },
  fullName: {
    type: VIRTUAL,
    get: function() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
});

Campus.hasMany(Student);
Student.belongsTo(Campus);

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });

    const createdCampuses = await Promise.all(
      Array(10).fill().map(() => {
        return Campus.create({
          name: faker.company.companyName(),
          address: faker.address.streetAddress(),
          description: faker.lorem.paragraph(),
          imageUrl: faker.image.avatar(),
        });
      }),
    );

    await Promise.all(
      Array(50).fill().map(() => {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        return Student.create({
          firstName,
          lastName,
          campusId: createdCampuses[Math.floor(Math.random() * createdCampuses.length)].id,
          gpa: Number((Math.random() * 4).toFixed(2)),
          email: `${firstName}.${lastName}@fb.com`,
          imageUrl: faker.image.avatar(),
        });
      })
    );

  } catch (error) {
    console.log(error);
  }
};

const app = express()

// static middleware
app.use('/dist', express.static(path.join(__dirname, '../dist')))
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
}); 

app.get('/api/campuses', async (req, res, next) => {
  try {
    res.send(await Campus.findAll({ orderBy: [['createdAt', 'DESC']] }));
  } catch (error) {
    next(error);
  }
});

app.post('/api/campuses', async (req, res, next) => {
  const { name, imageUrl, address, description } = req.body;
  try {
    res.status(201).send(await Campus.create({ name, imageUrl, address, description }));
  } catch (error) {
    next(error);
  }
});

app.put('/api/campus/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, imageUrl, address, description } = req.body;
  try {
    const campus = await Campus.findByPk(id);
    campus.name = name;
    campus.imageUrl = imageUrl;
    campus.address = address;
    campus.description = description;

    await campus.save();

    res.send(campus);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/campus/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await Campus.destroy({ where: { id }});
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.get('/api/students', async (req, res, next) => {
  try {
    res.send(await Student.findAll({ order: [['createdAt', 'DESC']] }));
  } catch (error) {
    next(error);
  }
});

app.get('/api/campuses/:id', async (req, res, next) => {
  try {
    res.send(await Campus.findByPk(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.get('/api/students/:id', async (req, res, next) => {
  try {
    res.send(await Student.findByPk(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.post('/api/students', async (req, res, next) => {
  const { firstName, lastName, email, imageUrl, gpa, campusId } = req.body;
  try {
    res.status(201).send(await Student.create({ firstName, lastName, email, imageUrl, gpa, campusId }));
  } catch (error) {
    next(error);
  }
});

app.put('/api/students/:id', async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, imageUrl, gpa, campusId } = req.body;

  try {
    const student = await Student.findByPk(id);
    student.firstName = firstName;
    student.lastName = lastName;
    student.email = email;
    student.imageUrl = imageUrl;
    student.gpa = gpa;
    student.campusId = campusId;
    await student.save();

    res.send(student);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/students/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await Student.destroy({ where: { id }});
    res.sendStatus(204);
  } catch (error) {
    next(error);
  } 
});

module.exports = { app, syncAndSeed };
