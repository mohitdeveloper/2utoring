namespace StandingOut.Shared.Helpers.GoogleHelper
{
    public enum PermissionsRole
    {
        owner = 4,
        fileOrganizer = 3,
        writer = 2,
        commenter = 1,
        reader = 0
    }

    public enum PermissionsType
    {
        user,
        group,
        domain,
        anyone
    }
}
