import { Link } from 'react-router-dom'

function HangoutCard(props) {
    return (
        <div>
            <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
            <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
                <img src="https://americanbehavioralclinics.com/wp-content/uploads/2023/06/Depositphotos_252922046_L.jpg" alt="card-image" />
            </div>
            <div className="p-4">
                <h6 className="mb-2 text-slate-800 text-xl font-semibold">
                {props.title}
                </h6>
                <p className="text-slate-600 leading-normal font-light">
                {props.date}
                </p>
                <p className="text-slate-600 leading-normal font-light">
                {props.location}
                </p>
            </div>
            <div className="px-4 pb-4 pt-0 mt-2">
                {/* <Link to={props.path}> */}
                    <button className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                    Learn More
                    </button>
                {/* </Link> */}
            </div>
            </div>  
        </div>
    )
}

export default HangoutCard