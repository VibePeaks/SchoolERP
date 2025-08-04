using FluentValidation;
using SchoolERP.API.Models;

namespace SchoolERP.API.Validators
{
    public class StudentValidator : AbstractValidator<Student>
    {
        public StudentValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(50);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(50);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.AdmissionDate).NotEmpty().LessThanOrEqualTo(DateTime.Today);
            RuleFor(x => x.ClassId).GreaterThan(0);
        }
    }
}