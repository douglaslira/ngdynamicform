/**
* ngMask
*
* @author Douglas Lira <douglas.lira.web@gmail.com>
* @url https://github.com/douglaslira/directives/ngform/
*/

$app = angular.module("App",[]);

$app.factory('FormatType', [function(){

	var format;
	return {
		date: function(v,o) {
			if(v) {
				var checkFormat = v.match(/\d{4}[-/\s]{1}\d{2}[-/\s]{1}\d{2}/);

				if(checkFormat){
					var newDate = new Date(v);
					format = newDate.getFullYear()+"-"+((newDate.getMonth() < 10) ? "0"+newDate.getMonth() : newDate.getMonth())+"-"+newDate.getDate();
				}
			}
			return format;
		}
	}

}]);

$app.factory('MakeInput', [function() {
	var loadLov, idLov, target;

	function wrap(input) {
		return  '<div>' + input + '</div>';
	}

	function applyAttributes(el, attributes) {
		angular.forEach(attributes, function(value, name) {
			el.attr(name, value);
		});
	}

	return {
		getName: function(name){
			var newName = name.replace(/[^a-zA-Z0-9]+/g, "");
			return newName;
		},
		checkLoadRule: function(){
			return [loadLov, idLov, target];
		},
		setFieldRule: function(trigger, work){
			var rule = {};
			rule.trigger = trigger;
			rule.valueTrigger = work[0].value;
			rule.idCheck = work[0].field.id;
			rule.ruleCheck = work[0].rule;
			if(work[0].rule == "ALTERAR_LOV"){
				rule.lovload = work[0].lov.id;
				loadLov = true;
				idLov = work[0].lov.id;
				target = work[0].field.id;
			}

			return rule;
		},
		getFieldRule: function(trigger, work){
			var rule = {};
			rule.trigger = trigger;
			rule.valueTrigger = work[0].value;
			rule.idCheck = work[0].field.id;
			rule.ruleCheck = work[0].rule;
			if(work[0].rule == "ALTERAR_ITEM"){
				rule.lovload = work[0].lov.id;
			}
			return rule;
		},
		/*setLov: function(opt){
			var item = null;
			angular.forEach(session.lovs, function(value) {
				if(value.id == opt){
					item = value;
				};
			});
			return item;
		},
		getLov: function(opt){
			var item = null;
			angular.forEach(session.lovs, function(value) {
				if(value.id == opt){
					item = value;
				};
			});
			return item;
		},*/
		make: function(options, check, rule) {
			var el, eltmp, name = options.id;
			var isValid = ((check == true) ? "required" : "");

			switch (options.type) {
				case 'string':

					el = angular.element('<input id="'+name+'" name="'+name+'" '+isValid+' class="form-control" type="text" ng-model="field.value" /><div ng-if="formWork.'+name+'.$invalid">OK</div>');
					if (options.attributes) {
						applyAttributes(el, options.attributes);
					}

					break;

				case 'integer':

					el = angular.element('<input id="'+name+'" name="'+name+'" '+isValid+' class="form-control" type="number" ng-model="field.value" />');
					break;

				case 'date':

					el = angular.element('<input id="'+name+'" name="'+name+'" '+isValid+' class="form-control" type="date" ng-model="field.value" />');
					if (options.attributes) {
						applyAttributes(el.find('input'), options.attributes);
					}
					break;

				/*case 'lov':

					var check = this.checkLoadRule();
					el = angular.element('<div id="div'+name+'">');
					if(check[2] == options.id){
						el.append('<select style="display:none" disabled id="lov'+name+'" '+isValid+' name="lov'+name+'" class="form-control" ng-model="field.value" ng-options="i.id as i.value for i in field.extra.items"><option value="">-- choose option --</option></select>');
					}
					el.append('<select id="'+name+'" name="'+name+'" '+isValid+' class="form-control" ng-model="field.value" ng-options="i.id as i.value for i in field.items.items"><option value="">-- choose option --</option></select>');
					break;*/

				case 'boolean':

					el = angular.element('<div id="div'+name+'"><select id="'+name+'" name="'+name+'" '+isValid+' class="form-control" ng-model="field.value" ng-options="i.id as i.value for i in field.items"><option value="">-- choose option --</option></select></div>');
					break;

				case 'email':

					el = angular.element('<input id="'+name+'" name="'+name+'" '+isValid+' class="form-control" type="text" ng-model="field.value" />');
					if (options.attributes) {
						applyAttributes(el.find('input'), options.attributes);
					}
					break;

				default:
					el = null;
			}
			return el;
		}
	};
}]);

$app.directive('field', ['FormatType', 'MakeInput', '$compile', function(FormatType, MakeInput, $compile) {
	return {
		scope: {
			field: '='
		},
		link: function($scope, $element, $attrs) {

			var field = $scope.field;

			if(field.workflows) {
				MakeInput.setFieldRule(field.id, field.workflows);
				var x = MakeInput.getFieldRule(field.id, field.workflows);
				console.log(x);
			}

			var tpl = MakeInput.make(field, true), el;
			if (tpl) {

				el = $compile(tpl)($scope);

				if(field.type == 'date'){
					field.value = FormatType.date(field.value);
				}

				if(field.type === 'boolean'){
					var items = [
						{id: true, value: 'Sim'},
						{id: false, value: 'Não'}
					]
					field.items = items;

					if(field.workflows) {
						var rule = MakeInput.getFieldRule(field.id, field.workflows);

						if(rule.trigger == field.id){
							el.bind("change", function (event) {

								var valCheck = ((angular.element("#"+rule.trigger).val() == 1) ? false : true);
								var objAdd = angular.element("#"+rule.idCheck);

								if(valCheck == rule.valueTrigger && rule.ruleCheck === "NAO_OBRIGATORIO"){
									objAdd.removeAttr("required").removeClass("ng-pristine ng-invalid ng-invalid-required");
								} else {

									if(valCheck != rule.valueTrigger && rule.ruleCheck === "OBRIGATORIO") {
										objAdd.removeAttr("required").removeClass("ng-pristine ng-invalid ng-invalid-required");
									} else {
										console.log(field, "OKKK");
										objAdd.attr("required",true).addClass("ng-pristine ng-invalid ng-invalid-required");
									}
								}

							});
						}
					}
				}

				if(field.type === "integer") {
					el.bind("keydown", function (event) {

						var keyCode = event.keyCode || event.charCode;

						if (!((keyCode >= 48 && keyCode <= 57) || keyCode === 44 || keyCode === 45 || keyCode === 8)) {
							event.preventDefault && event.preventDefault();
							event.stopPropagation && event.stopPropagation();
							event.stopImmediatePropagation && event.stopImmediatePropagation();
							event.returnValue = false;
							event.cancelBubble = true;
							return;
						}
					});
				}
				$element.empty().append(el);
			}
		}

	}
}]);

$app.directive('objectDirective', ['$compile', 'FormatType', function($compile, FormatType) {
	var tmp = [
		'<form name="formWork" id="formWork" ng-submit="save(formWork.$valid);">',
		'  <div class="module-header clearfix">',
		'    <h1 class="module-title">{{title}}</h1>',
		'  </div>',
		'  <section class="module-content">',
		'    <div class="card-wrapper">',
		'      <div class="card">',
		'        <h2 class="card-title">Informações</h2>',
		'      </div>',
		'      <div id="listADD"></div>',
		'      <div class="btn-group btn-group-justified">',
		'        <div class="btn-group btn-group-card">',
		'          <button type="button" class="btn btn-warning" ng-hide="showBtnRemove" ng-click="remove()">Excluir</button>',
		'        </div>',
		'        <div class="btn-group btn-group-card">',
		'          <button type="submit" class="btn btn-success" ng-disabled="formWork.$invalid">Salvar</button>',
		'        </div>',
		'      </div>',
		'    </div>',
		'  </section>',
		'</form>'
	];
	return {
		restrict: 'E',
		replace: true,
		scope: {
			ngModel: '=',
			title: '@',
			onSave: '&',
			onRemove: '&'
		},
		template: tmp.join(''),
		link: function($scope, $element, $attrs) {

			var dl = angular.element("#listADD");
			var showHide = ((!$scope.remove) ? true : false);


			$scope.showBtnRemove = showHide;

			$scope.save = function(isValid){

				if(isValid){
					var newObj = [];
					$scope.ngModel.forEach(function(field) {
						if(field.type === 'date'){
							field.value = ((!field.value) ? "" : field.value.split("-").reverse().join("/"));
						}
						newObj.push(field);
					});
					$scope.onSave({o: newObj});
				} else {
					console.log("INVÁLIDO");
				}
			}

			$scope.remove = function(){
				$scope.onRemove({o: "REMOVE"});
			}

			$scope.ngModel.forEach(function(field) {
				var fieldScope = $scope.$new();
				fieldScope.field = field;
				var content = [
					'<div class="form-group">',
					'<label>',field.name,'</label>',
					'<div field="field"></div>',
					'</div>'
				]
				dl.append($compile(content.join(''))(fieldScope));
			});

		}
	}
}]);