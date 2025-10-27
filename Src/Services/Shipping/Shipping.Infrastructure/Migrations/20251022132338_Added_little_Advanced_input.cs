using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shipping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Added_little_Advanced_input : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CountriesJson",
                schema: "shipping",
                table: "customer",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomerTypeId",
                schema: "shipping",
                table: "customer",
                type: "integer",
                maxLength: 512,
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                schema: "shipping",
                table: "customer",
                type: "character varying(512)",
                maxLength: 512,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HobbiesJson",
                schema: "shipping",
                table: "customer",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountriesJson",
                schema: "shipping",
                table: "customer");

            migrationBuilder.DropColumn(
                name: "CustomerTypeId",
                schema: "shipping",
                table: "customer");

            migrationBuilder.DropColumn(
                name: "Gender",
                schema: "shipping",
                table: "customer");

            migrationBuilder.DropColumn(
                name: "HobbiesJson",
                schema: "shipping",
                table: "customer");
        }
    }
}
