import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';


export class UtilHelper {
    static waterfall(series) {
        return Observable.defer(() => {
            var acc = series[0]();
            for (var i = 1, len = series.length; i < len; i++) {
                (function (func) {
                    acc = acc.switchMap(x => func(x));
                }(series[i]));
            }
            return acc;
        });
    }
}
