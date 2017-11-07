This is a simple react app with a table containing data from a mySql database,
and 2 other routes.

Uses ES6 babel transpiling.
Uses react-bootstap for styling:
    https://react-bootstrap.github.io/components.html
    (I've also used material-ui, which is also quite nice. Both are works in progress)

Noteable files/folders:
    ./src/Modules:
        Holds all created React modules. I often split these into "component"/"container"
        folders, containers being larger pages and components being single elements. I've
        not done this for this skeleton, but I might, for example, put the table in a
        home->components->studentTable.js file, and import it into
        home->containers->home.js
    ./App.js:
        This is similar to a "main" c++ function for our website. It ties together our
        modules into a single element, which is rendered by './index.js'. Note how the
        <Header> object is rendered within the <Router>, but outside of the <Switch>, and
        is therefor rendered on every page.
    ./App.css:
        Holds all css for the app. I've not changed this from the default created. In general,
        try to stick to css of your chosen wrapper (bootstrap/material-ui) for consistency and
        ease of development.
    ./api:
        This holds the entire api implementation. app.js creates the routes that index.js
        serves. You'll probably only need to change app.js.
    ./api/connection:
        Holds the credentials of your sql database. Currently pointed at a database of mine.

Uses react-bootstrap currently for styling, I can also show you
how to use material-ui if that's preferred.

It uses two elements, the api and the app itself.

To test:
    App:
        run "npm start"
    Api:
        within './api' run "npm start"

Both of these are set up to automatically restart upon changes in this mode.

Adding routes to the app:
    1. Create a new file under ./src/Modules, and export a react element.
        ex:
            //imports
            class Example extends Component{
                render(){
                    return <div>Example!</div>
                }
            }
    2. Import your new file into ./src/App.js
        ex:
            Import Example from './Modules/example';
    3. Still in App.js, add a new Route under the <Switch> element in the return
        ex:
            <Route exact path="/" component={Home}/>
    4. If needed, add a new NavLink to the created Route under './Modules/header.js'

Adding and calling routes with the api:
    Adding:
    1.Under './api/app.js' add the new route in the form:
        router.get('/newRoute', (req, res) =>{
            const query = "SELECT * FROM table..."
            connection.query(query, function (err, result) {
                if (err)
                    res.send(err);
                res.json(result);
            })
        });
    Calling:
    1. I use axios for my db calls, so import that in the desired file
    2. Create a constructor(props) function, and set an initial state with
       a variable to hold database data.
    3. Create a componentWillMount() function, within it, use axios to make a call to
       the desired route; ie 'http://localhost:8080/Students' is the existing route.
       Axios returns a promise, so suffix it with .then((res,err) => {/*function*/}),
       and use the /*function*/ space to set the state variable with the result, or handle
       the error if needed.
    4. In the render function, return a loading page if the data doesn't have expected
       contents, or an error if applicable.
    5. Return desired page.