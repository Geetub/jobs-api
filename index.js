const express = require('express')
const storage = require('node-persist');
const auth = require('./auth');
const dbDir = 'db/jobs';
const port = 3001

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var jobs;

app.get('/jobs', auth.verifyToken, async (req, res) =>{
    res.header("Access-Control-Allow-Origin", "*");    
    return res.send(jobs);
});

app.get('/jobs/:id', auth.verifyToken, async (req, res) =>{
    res.header("Access-Control-Allow-Origin", "*");
	const found_job = jobs.find( job => job.id == req.params.id);
	if (!found_job)
		return res.status(404).send("Not found")
    return res.send(found_job);
});

app.post('/jobs', auth.verifyToken, async (req, res) =>{
    res.header("Access-Control-Allow-Origin", "*");
	const new_job = { 
		id: jobs.length,
		employer: req.body.employer,
		title: req.body.employer,
		published: (new Date()).toISOString()};
		
	jobs.push( new_job );
	await jobs_storage.setItem( new_job.id.toString(), new_job);
    return res.send(jobs);
}); 

app.post("/register", (req, res) => {
	// our register logic goes here...
});
	
app.post("/login", (req, res) => auth.login(req,res));

async function init() {
	jobs_storage = await storage.create({dir : dbDir});
	await jobs_storage.init();
	jobs = await jobs_storage.values();
	app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

init();

/*
fetch('http://localhost:3001/login', {
	method: 'POST', 
	mode: 'cors', 
	cache: 'no-cache',  
	headers: { 'Content-Type': 'application/json' }, 
	body: JSON.stringify({email:"bob@gmail.com", password: "password"}) }).then(r => r.json()).then(t => res=t)	

	fetch('http://localhost:3001/jobs', { 
	method: 'POST', 
	mode: 'cors', 
	cache: 'no-cache',  
	headers: { 'Content-Type': 'application/json' }, 
	body: JSON.stringify({employer:"WeWork", title: "CEO"}) })
	
	fetch('http://localhost:3001/jobs', {
	mode: 'cors', 
	cache: 'no-cache',
	headers: { 'Content-Type': 'application/json', 'x-access-token': res.token }}
	).then(r => r.json()).then(t => console.log(t))
*/
