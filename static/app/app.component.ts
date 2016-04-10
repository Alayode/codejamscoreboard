import {Component} from 'angular2/core';
import {HTTP_PROVIDERS}    from 'angular2/http';

import {Competitor} from './competitor';
import {CompetitorService} from './competitor.service';

@Component({
	selector: 'my-app',
	template: `
	<div class="container">
    <h1>{{title}}</h1>

    <form class="form-inline">
		<div class="form-group">    
		    <label>Country</label>
		    <select class="form-control"
		    	[(ngModel)]="currentCountry"
		    	(change)="onCountryChange($event.target.value)">
		      <option *ngFor="#c of countries" [value]="c">{{c}}</option>
		    </select>
		</div>
	    &nbsp;
		  <div class="form-group">
		    <label>Username</label>
		    <input type="text" [(ngModel)]="searchedUser" class="form-control" placeholder="Username">
		  <button class="btn btn-default" (click)="onSearchUser()">Search</button>
		  </div>
	</form>

	<nav>
	  <ul class="pagination">
	    <li *ngFor="#page of pages" [class.active]="page === currentPage">
	    	<a href="#" (click)="onPageClick(page)">{{page+1}}</a>
	    </li>
	  </ul>
	</nav>

    <table class="table table-striped">
    	<thead>
	      <tr>
	        <th>Rank</th>
	        <th>Percentile</th>
	        <th>Absolute Rank</th>
	        <th>Abs. Percentile</th>
	        <th>Username</th>
	        <th>Score</th>
	        <th></th>
	      </tr>
		</thead>
		<tbody>
	      <tr [class.highlight]="comp.username.toUpperCase() === searchedUser.toUpperCase()" *ngFor="#comp of comps">
	        <td>{{comp.row_num}}</td>
	        <td>{{1 - comp.row_num / totalCompetitors | percent:'2.2-2'}}</td>
	        <td>{{comp.rank}}</td>
	        <td>{{1 - comp.rank / 27170 | percent: '2.2-2'}}</td>
	        <td>{{comp.username}}</td>
	       	<td>{{comp.points}}</td>
	       	<td><a *ngIf="comp.username.toUpperCase() === searchedUser.toUpperCase()" href="https://twitter.com/intent/tweet?button_hashtag=CodeJam2016&text=I%20finished%20{{comp.row_num}}%20out%20of%20{{totalCompetitors}}%20in%20{{currentCountry}} in the Qualification Round" class="twitter-hashtag-button"><i></i>Tweet #CodeJam2016</a></td> 
	      </tr>
	    </tbody>
    </table>
    </div>
  `,
  styles: [`
  	.table-striped tbody tr.highlight td {
  		background-color: #ADD8E6;
  	}
  	.twitter-hashtag-button {
	  	position: relative;
	    height: 20px;
	    padding: 1px 8px 1px 6px;
	    font-weight: 500;
	    color: #fff;
	    cursor: pointer;
	    background-color: #1b95e0;
	    border-radius: 3px;
	    box-sizing: border-box;
  	}
  	.twitter-hashtag-button i {
	    position: relative;
	    top: 2px;
	    display: inline-block;
	    width: 14px;
	    height: 14px;
	    background: transparent 0 0 no-repeat;
	    background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2072%2072%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h72v72H0z%22%2F%3E%3Cpath%20class%3D%22icon%22%20fill%3D%22%23fff%22%20d%3D%22M68.812%2015.14c-2.348%201.04-4.87%201.744-7.52%202.06%202.704-1.62%204.78-4.186%205.757-7.243-2.53%201.5-5.33%202.592-8.314%203.176C56.35%2010.59%2052.948%209%2049.182%209c-7.23%200-13.092%205.86-13.092%2013.093%200%201.026.118%202.02.338%202.98C25.543%2024.527%2015.9%2019.318%209.44%2011.396c-1.125%201.936-1.77%204.184-1.77%206.58%200%204.543%202.312%208.552%205.824%2010.9-2.146-.07-4.165-.658-5.93-1.64-.002.056-.002.11-.002.163%200%206.345%204.513%2011.638%2010.504%2012.84-1.1.298-2.256.457-3.45.457-.845%200-1.666-.078-2.464-.23%201.667%205.2%206.5%208.985%2012.23%209.09-4.482%203.51-10.13%205.605-16.26%205.605-1.055%200-2.096-.06-3.122-.184%205.794%203.717%2012.676%205.882%2020.067%205.882%2024.083%200%2037.25-19.95%2037.25-37.25%200-.565-.013-1.133-.038-1.693%202.558-1.847%204.778-4.15%206.532-6.774z%22%2F%3E%3C%2Fsvg%3E");
	}
  `],
  providers: [
  	HTTP_PROVIDERS,
  	CompetitorService
  	]
})

export class AppComponent {
	title = 'CodeJam Scoreboard Qualification Round 2016';
	comps: Competitor[];
	countries: string[] = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antarctica", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burundi", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Chile", "China", "Christmas Island", "Colombia", "Congo [DRC]", "Congo [Republic]", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "C\u00f4te d'Ivoire", "Decline to Answer", "Denmark", "Dominican Republic", "Ecuador", "Egypt", "Eritrea", "Estonia", "Ethiopia", "Finland", "France", "French Polynesia", "Gabon", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Guadeloupe", "Guatemala", "Guernsey", "Guinea", "Haiti", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan", "Latvia", "Lebanon", "Lesotho", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia [FYROM]", "Madagascar", "Malaysia", "Mali", "Malta", "Marshall Islands", "Mauritius", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar [Burma]", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "R\u00e9union", "Saint Barth\u00e9lemy", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "U.S. Minor Outlying Islands", "U.S. Virgin Islands", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vatican City", "Venezuela", "Vietnam", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe", "\u00c5land Islands"];
	pages: number[];
	currentPage: number;
	currentCountry: string;
	totalCompetitors: number;
	totalPages: number;
	searchedUser: string;

	constructor(private _competitorService: CompetitorService) { }

	getCompetitors(country, page) {
		var that = this;
		this.currentPage = page;
		this.currentCountry = country;
		this._competitorService.getCompetitors(country, page)
			.subscribe(function(data) {
				that.totalCompetitors = data.num;
				that.totalPages = Math.floor(data.num / 30);
				var delta = 10;
				var firstPage = Math.max(0, that.currentPage - delta);
				var lastPage = Math.min(that.currentPage + delta, that.totalPages);
				that.pages = [];
				for (var i = firstPage; i <= lastPage; i++) {
					that.pages.push(i);
				}
				that.comps = data.data;
			});
	}

	onCountryChange(country) {
		if (country) {
			this.getCompetitors(country, 0);
		}
	}

	onPageClick(page) {
		this.getCompetitors(this.currentCountry, page);
	}

	onSearchUser() {
		var that = this;
		this._competitorService.getPageFromCompetitor(this.searchedUser)
			.subscribe(function(data) {
				if (data.country) {
					that.getCompetitors(data.country, data.page);
				} else {
					alert('There\'s no such user. Search is case insensitive.');
				}
			});
	}
}