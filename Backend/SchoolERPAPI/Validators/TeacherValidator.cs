using FluentValidation;
using SchoolERP.API.Models;

namespace SchoolERP.API.Validators
{
    public class TeacherValidator : AbstractValidator<Teacher>
    {
        public TeacherValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(50);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(50);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Qualification).NotEmpty();
            RuleFor(x => x.JoiningDate).NotEmpty().LessThanOrEqualTo(DateTime.Today);
        }
    }
}