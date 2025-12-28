using System.Threading;

namespace SchoolERP.API.Middleware
{
    public static class TenantContext
    {
        private static readonly AsyncLocal<int?> _tenantId = new AsyncLocal<int?>();

        public static int? GetTenantId()
        {
            return _tenantId.Value;
        }

        public static void SetTenantId(int? tenantId)
        {
            _tenantId.Value = tenantId;
        }
    }
}
