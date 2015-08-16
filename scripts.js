/**
 * Created by Shawn on 8/15/15.
 */
// form selectors
var $form = $('#Info_frm');
var $first = $('#FirstName');
var $last = $('#LastName');
var $number = $('#EmployeeNum');
var $title = $('#Title');
var $review = $('#Review');
var $salary = $('#Salary');

// selectors, objects for handling the lists
var $employUl = $('#Employees_ul');
var employeesArray = new Array();
var $ul = $('<ul>');
$ul.addClass('employee');
var $li1 = $('<li>');
var $li2 = $('<li>');
var $li3 = $('<li>');
$li2.addClass('hidden info');
var $remove = $('<button>');
$remove.text("X");
$remove.addClass("remove");

var totalSal = 0;
var randomTitles = ["Clerk", "Assistant", "Accountant", "Systems Engineer", "Tech Support", "Janitor",
	"EVP", "Salesman", "Customer Service"];

$(document).ready(function()
{
	showSalary();
	//console.log("Ready");
	$('#Add_btn').on('click', function (e)
	{
		// get employee number for checking and adding employee
		var num = parseInt($('#EmployeeNum').val());
		var exists = false;
		// check to make sure employee hasn't already been added
		for(var i = 0;i < employeesArray.length; i++)
		{
			if(employeesArray[i].number == num)
			{
				alert("Employee has already been added.");
				exists = true;
			}
		}
		if(exists == false)
		{
			//// reset ul and li items
			//$ul.find('li').remove();
			//$ul.removeClass().addClass('employee');
			//
			//// add new employee object to array
			//employeesArray.push(new Employee($first.val(), $last.val(), parseInt($number.val()),
			//	$title.val(), parseInt($review.val()), parseInt($salary.val())));
			//var i = employeesArray.length - 1;
			//console.log(employeesArray[i]);
			//
			//// generate lists objects for display
			//$li.text(employeesArray[i].getName());
			//$li.append($remove);
			////console.log($li.text());
			//$ul.append($li);
			//
			//// create 2nd li with the extra info, to be hidden unless hover over name
			//$li2.text(employeesArray[i].getTitledInfo());
			//$ul.append($li2);
			//
			//// name ul so can track back to object, add rating class to ul
			//$ul.attr('id', 'id'+ employeesArray[i].number);
			//$ul.addClass('rating'+employeesArray[i].review);
			//$('#Employees_ul').append($ul);
			//
			//// after adding ul/li's, sort array to alphabetize
			//employeesArray.sort();

			// add new employee object to array
			employeesArray.push(new Employee($first.val(), $last.val(), parseInt($number.val()),
				$title.val(), parseInt($review.val()), parseInt($salary.val())));
			var i = employeesArray.length - 1;
			console.log(employeesArray[i]);

			addSalary(employeesArray[employeesArray.length - 1].salary);

			// call function to create and add ul/li to employees list
			addToList();

			// after adding ul/li's, sort array to alphabetize
			//employeesArray.sort();
			sortArray();
			sortList();
		}
		e.preventDefault();
	});

	$('#Random_btn').click(function (e)
	{
		//alert("Random!");
		//$form.find("input").removeAttr("required");
		var random = new Employee();
		employeesArray.push(random);
		addToList();

		addSalary(employeesArray[employeesArray.length - 1].salary);

		//console.log("Works here");

		// after adding ul/li's, sort array to alphabetize
		employeesArray.sort();
		//console.log("after here");
		sortArray();
		//sortList();
		e.preventDefault();

	});

	$($employUl).on('mouseenter', '.employee li:first-child', function (e)
	{
		//console.log("middle enter", $(this).text());
		$(this).next().removeClass('hidden');
		e.preventDefault();
	});

	$($employUl).on('mouseleave', '.employee li:first-child', function (e)
	{
		//console.log("middle leave", $(this).text());
		$(this).next().addClass('hidden');
		e.preventDefault();
	});

	$($employUl).on("click", ".remove", function(e)
	{
		var $ul = $(this).closest(".employee");
		var id = $ul.data('id');
		//console.log("id for processing", id);
		//id = removeNonNumeric(id);
		employeesArray.forEach(function (element, index)
		{
			if(element.number == id)
			{
				removeSalary(employeesArray[index].salary);
				employeesArray.splice(index, 1);
				return true;
			}
		});
		$ul.remove();
		e.preventDefault();
	});
});

function removeNonNumeric(str){
	var numericString = str.replace(/[^0-9]/g, '');
	return numericString;
}

function Employee(first, last, num, title, review, salary)
{

	this.getName = function ()
	{
		return this.lastName +", "+ this.firstName;
	};

	this.getTitledInfo = function ()
	{
		return "Number: "+ this.number +" Title: "+ this.title +" Review: "+ this.review +" Salary: $"+ this.salary.toLocaleString();
	};

	this.getAllInfo = function ()
	{
		return this.lastName +", "+ this.firstName +" Number: "+ this.number +" Title: "+
			this.title +" Review: "+ this.review +" Salary: $"+ this.salary.toLocaleString();
	}

	this.randomize = function ()
	{
		this.firstName = chance.first();
		this.lastName = chance.last();
		// assume the employee number already exists, until proven otherwise
		var exists = true;
		while(exists == true)
		{
			var num = chance.integer({min: 1, max: 999});
			var insideExists = false;
			// loop through array to find if employee number exists. Breaks if found to start process over.
			for(var i = 0;i < employeesArray.length; i++)
			{
				if(employeesArray[i].number == num)
				{
					insideExists = true;
					break;
				}
			}
			//employeesArray.forEach(function (element)
			//{
			//	// if find it in, set to true and break so can start the randomize number process again
			//	if(element.number == num)
			//	{
			//		insideExists = true;
			//	}
			//});
			// if wasn't found in array, accept the number as not having been taken
			if(insideExists == false)
			{
				this.number = num;
				exists = false;
			}
		}
		this.title = randomTitles[chance.integer({min: 0, max: 8})];
		this.review = chance.integer({min: 1, max: 5});
		this.salary = chance.integer({min: 20000, max: 200000});
		console.log("Randomized!", this.getAllInfo());
		return true;
	};

	// if first name is set to 0 (int), then create random employee
	if(first != undefined)
	{
		this.firstName = first;
		this.lastName = last;
		this.number = num;
		this.title = title;
		this.review = review;
		this.salary = salary;
	}else
	{
		this.randomize();
	}
}

function addSalary(sal)
{
	totalSal += sal;
	showSalary();
}

function removeSalary(sal)
{
	totalSal -= sal;
	showSalary();
}

function showSalary()
{
	$('#TotalSalary_spn').text('$'+ totalSal.toLocaleString());
}

// for adding new entries to ul, assumes last one entered is desired
function addToList()
{
	var i = employeesArray.length - 1;
	$ul = $('<ul>',
		{
			'data-id': employeesArray[i].number,
			'class': 'employee rating'+ employeesArray[i].review
		});
	//$ul.addClass('employee rating'+ employeesArray[i].review);
	//console.log("id", employeesArray[i].number);
	//$ul.data('id', employeesArray[i].number);
	//$ul.append('<li data-id="'+ employeesArray[i].number +'">' +employeesArray[i].getName() +'</li>');
	//$li5 = $('<li>');
	//$li5.text(employeesArray[i].getName());
	//$li5.data('id', employeesArray[i].number);
	var name = employeesArray[i].getName();
	$li1 = $('<li>');
	$li1.text(name);
	//$.extend(true, $li1, $remove);
	//$li1.append($.extend(true, {}, $remove));
	$remove.clone().appendTo($li1);
	//$li1.append($remove);
	$li2 = $('<li>', {
		'class': 'hidden info'
	});
	$li2.text(employeesArray[i].getTitledInfo());
	//$ul.append('<li>' +employeesArray[i].getName() +'</li>');
	$ul.append($li1);
	$ul.append($li2);
	//$ul.append($remove);
	//$ul.append('<li class="hidden info">' +employeesArray[i].getTitledInfo() +'</li>');

	var inserted = false;
	//$employUl.append($ul);
	if($employUl.find('.employee').length == 0)
	{// insert if no employees are listed
		$employUl.append($ul);
		inserted = true;
	}else
	{
		// iterate employee UL's, see where it belongs alphabetically
		$employUl.find('.employee :first-child').each(function(i, el)
		{
			//console.log($(this).text(), name, "index "+ i, name < $(this).text());
			if(name < $(this).text() == true && inserted == false)
			{
				//console.log("True, should be working");
				inserted = true;
				//$ul.insertBefore($(this));
				$ul.insertBefore($(this).closest('.employee'));
				//$(this).closest('.employee').before($ul);
				return true;
			}
		});
		if(inserted == false)
		{
			//console.log("Appended");
			$employUl.append($ul);
		}
	}

}

function sortList()
{
	employeesArray.forEach(function (element, index)
	{
		$employUl.find("#id"+ element.number).index(index);
	});
}

function sortArray()
{// working here
	//var array = new Array();
	//var oldArray = new Array();
	//var newArray = new Array();
	//employeesArray.forEach(function (element, index)
	//{
	//	array.push(element.lastName + ", "+ element.firstName);
	//	oldArray.push(element);
	//});
	//array.sort();
	//console.log(array);
	//array.forEach(function (element, index)
	//{
	//	oldArray.forEach(function (element, index)
	//	{
	//		if(element.last)
	//	});
	//	newArray.push();
	//});

	//var listArray = $.map($employUl.find('.employee'), function (data, i)
	//{
	//	console.log(data-id);
	//	//console.log(el.text());
	//	//return el.data('id');
	//});

	// returns data-id attr of ul's
	var listArray = $employUl.find('.employee').map(function() {
		return [$.map($(this).data(), function(v) {
			return v;
		})];
	}).get();
	//console.log(listArray);
	//
	//var nameArray = $employUl.find('ul:first-child').map(function(innerHTML) {
	//	return innerHTML;
	//}).get();
	//console.log(nameArray);
}