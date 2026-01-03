using FluentValidation;
using SchoolERP.API.Models;

namespace SchoolERP.API.Validators
{
    public class ParentMessageValidator : AbstractValidator<ParentMessage>
    {
        public ParentMessageValidator()
        {
            RuleFor(x => x.SenderId).GreaterThan(0);
            RuleFor(x => x.ReceiverId).GreaterThan(0);
            RuleFor(x => x.StudentId).GreaterThan(0);
            RuleFor(x => x.Subject).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Message).NotEmpty().MaximumLength(2000);
            RuleFor(x => x.MessageType).NotEmpty().MaximumLength(50);
        }
    }
}
