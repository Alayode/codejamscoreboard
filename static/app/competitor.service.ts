import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Competitor}     from './competitor';
import {Observable}     from 'rxjs/Rx';

@Injectable()
export class CompetitorService {
	constructor(private http: Http) { }

	private _compsUrl = 'comps';
	private _pageUrl = 'page';

	getCompetitors(country, offset) {
		return this.http.get(this._compsUrl + '/' + country + '/' + offset)
			.map(res => res.json())
			.catch(this.handleError);
	}
	private handleError(error: Response) {
		// in a real world app, we may send the error to some remote logging infrastructure
		// instead of just logging it to the console
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}

	getPageFromCompetitor(comp) {
		return this.http.get(this._pageUrl + '/' + comp)
			.map(res => res.json())
			.catch(this.handleError);
	}
}
