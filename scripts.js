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
var $remove = $('<button>');
$remove.text("X");
$remove.addClass("js-remove");

var totalSal = 0;
var randomTitles = ["Clerk", "Assistant", "Accountant", "Systems Engineer", "Tech Support", "Janitor",
	"EVP", "Salesman", "Customer Service"];

$(document).ready(function()
{
	showSalary();

	$('#Add_btn').on('click', function (e)
	{
		// get employee number for checking and adding employee, setting exists to false to check if it already exists
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

		// employee hasn't been added, continue
		if(exists == false)
		{
			// add new employee object to array
			employeesArray.push(new Employee($first.val(), $last.val(), $number.val(),
				$title.val(), $review.val(), $salary.val()));
			var i = employeesArray.length - 1;
			console.log(employeesArray[i]);

			// add this employees salary to the total
			addSalary(employeesArray[employeesArray.length - 1].salary);

			// call function to create and add ul/li to employees list
			addToList();
		}
		e.preventDefault();
	});

	$('#Random_btn').click(function (e)
	{
		var random = new Employee();
		employeesArray.push(random);
		addToList();

		addSalary(employeesArray[employeesArray.length - 1].salary);

		e.preventDefault();
	});

	$($employUl).on('mouseenter', '.js-employee li:first-child', function (e)
	{
		//console.log("middle enter", $(this).text());
		$(this).next().removeClass('hidden');
		e.preventDefault();
	});

	$($employUl).on('mouseleave', '.js-employee li:first-child', function (e)
	{
		//console.log("middle leave", $(this).text());
		$(this).next().addClass('hidden');
		e.preventDefault();
	});

	$($employUl).on("click", ".js-remove", function(e)
	{
		var $ul = $(this).closest(".js-employee");
		var id = $ul.data('id');
		// iterate the array of employee objects to find that employee and remove it
		employeesArray.forEach(function (element, index)
		{
			if(element.number == id)
			{
				alert(employeesArray[index].getForwardName() +" has been terminated.");
				removeSalary(employeesArray[index].salary);
				employeesArray.splice(index, 1);
				return true;
			}
		});
		// remove the parent ul for employee from list
		$ul.remove();
		e.preventDefault();
	});
});

var Employee = function(first, last, num, title, review, salary)
{

	this.getName = function ()
	{
		return this.lastName +", "+ this.firstName;
	};

	this.getTitledInfo = function ()
	{
		return "Number: "+ this.number.toLocaleString() +" Title: "+ this.title +" Review: "+ this.review +" Salary: $"+ this.salary.toLocaleString();
	};

	this.getAllInfo = function ()
	{
		return this.lastName +", "+ this.firstName +" Number: "+ this.number.toLocaleString() +" Title: "+
			this.title +" Review: "+ this.review +" Salary: $"+ this.salary.toLocaleString();
	};

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

		return true;
	};

	this.getForwardName = function()
	{
		return this.firstName +" "+ this.lastName;
	};

	// if first name is set to 0 (int), then create random employee
	if(first != undefined)
	{
		this.firstName = first;
		this.lastName = last;
		if(isNaN(num))
		{
			this.number = parseInt(removeNonNumeric(num));
		}else
		{
			this.number = num;
		}
		this.title = title;
		this.review = review;
		if(isNaN(salary))
		{
			this.salary = parseInt(removeNonNumeric(salary));
		}else
		{
			this.salary = salary;
		}
	}else
	{
		this.randomize();
	}
};

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
	var $ul = $('<ul>',
		{
			'data-id': employeesArray[i].number,
			'class': 'js-employee rating'+ employeesArray[i].review
		});

	var name = employeesArray[i].getName();
	var $li1 = $('<li>',
		{
			'class': 'js-empName'
		});
	$li1.text(name);

	$remove.clone().appendTo($li1);

	var $li2 = $('<li>', {
		'class': 'hidden info'
	});
	$li2.text(employeesArray[i].getTitledInfo());

	$ul.append($li1);
	$ul.append($li2);

	// needed to make sure it stops checking once it's been inserted, or to add it at end if it's alphabetically the last employee
	var inserted = false;

	if($employUl.find('.js-employee').length == 0)
	{// insert if no employees are listed
		$employUl.append($ul);
		inserted = true;
	}else
	{
		// iterate employee UL's, see where it belongs alphabetically
		$employUl.find('.js-empName').each(function()
		{
			if(name < $(this).text() == true && inserted == false)
			{
				inserted = true;
				$ul.insertBefore($(this).closest('.js-employee'));
				return true;
			}
		});
		// insert as last since it hasn't been inserted yet
		if(inserted == false)
		{
			$employUl.append($ul);
		}
	}
}

function removeNonNumeric(str){
	var numericString = str.replace(/[^0-9]/g, '');
	return numericString;
}
