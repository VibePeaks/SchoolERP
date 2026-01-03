using SchoolERPAPI.Testing.Controllers;

namespace SchoolERPAPI.Tests;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        // This test project references the testing library
        // Tests are implemented in SchoolERPAPI.Testing project
        var busTrackingTests = new BusTrackingControllerTests();
        Assert.NotNull(busTrackingTests);
    }
}
