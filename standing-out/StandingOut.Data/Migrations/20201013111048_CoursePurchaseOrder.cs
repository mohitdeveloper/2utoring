using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StandingOut.Data.Migrations
{
    public partial class CoursePurchaseOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "StandingOutPercentageCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.AlterColumn<decimal>(
                name: "StandingOutActualCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.DropColumn(
                name: "IsRefundStudentInitiated",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "PaymentIntentId",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "RefundedAmount",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "RefundedBy",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "RefundedDate",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "StripePayoutError",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "TutorPaid",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "TutorPaymentFailureNote",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "TutorStripePayoutId",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "TutorStripeTransferId",
                table: "SessionAttendees");

            migrationBuilder.AddColumn<Guid>(
                name: "AttendeeRefundId",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrderId",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrderItemId",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "VendorAmount",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "VendorEarningId",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrderItemId",
                table: "CourseInvites",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PaymentProviderFields",
                columns: table => new
                {
                    PaymentProviderFieldSetId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    PaymentProvider = table.Column<int>(nullable: false),
                    ReceiptId = table.Column<string>(nullable: true),
                    PaymentMethodId = table.Column<string>(nullable: true),
                    VendorCreditId = table.Column<string>(nullable: true),
                    CreditLinkBack = table.Column<string>(nullable: true),
                    VendorPayoutId = table.Column<string>(nullable: true),
                    UserRefundId = table.Column<string>(nullable: true),
                    PaymentProviderFieldSetType = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentProviderFields", x => x.PaymentProviderFieldSetId);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    OrderStatus = table.Column<int>(nullable: false),
                    OrderProcessingNote = table.Column<string>(maxLength: 2000, nullable: true),
                    PayerUserId = table.Column<string>(nullable: false),
                    OrderPaymentStatus = table.Column<int>(nullable: false),
                    AmountCharged = table.Column<decimal>(type: "decimal(13,4)", nullable: true),
                    Currency = table.Column<string>(maxLength: 3, nullable: true),
                    PaymentProviderFieldSetId = table.Column<Guid>(nullable: true),
                    PromoCodeId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_Orders_AspNetUsers_PayerUserId",
                        column: x => x.PayerUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_PaymentProviderFields_PaymentProviderFieldSetId",
                        column: x => x.PaymentProviderFieldSetId,
                        principalTable: "PaymentProviderFields",
                        principalColumn: "PaymentProviderFieldSetId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_PromoCodes_PromoCodeId",
                        column: x => x.PromoCodeId,
                        principalTable: "PromoCodes",
                        principalColumn: "PromoCodeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VendorPayouts",
                columns: table => new
                {
                    VendorPayoutId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    TutorId = table.Column<Guid>(nullable: true),
                    CompanyId = table.Column<Guid>(nullable: true),
                    AmountPaid = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    PaymentDate = table.Column<DateTimeOffset>(nullable: false),
                    PaymentProviderFieldSetId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VendorPayouts", x => x.VendorPayoutId);
                    table.ForeignKey(
                        name: "FK_VendorPayouts_Companys_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companys",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VendorPayouts_PaymentProviderFields_PaymentProviderFieldSetId",
                        column: x => x.PaymentProviderFieldSetId,
                        principalTable: "PaymentProviderFields",
                        principalColumn: "PaymentProviderFieldSetId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VendorPayouts_Tutors_TutorId",
                        column: x => x.TutorId,
                        principalTable: "Tutors",
                        principalColumn: "TutorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    OrderItemId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    OrderId = table.Column<Guid>(nullable: false),
                    CourseId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.OrderItemId);
                    table.ForeignKey(
                        name: "FK_OrderItems_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderRefunds",
                columns: table => new
                {
                    OrderRefundId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    OrderId = table.Column<Guid>(nullable: false),
                    RefundProcessingStatus = table.Column<int>(nullable: false),
                    PaymentProviderFieldSetId = table.Column<Guid>(nullable: true),
                    RefundProcessingNote = table.Column<string>(maxLength: 2000, nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(13,4)", nullable: true),
                    Deduction = table.Column<decimal>(type: "decimal(13,4)", nullable: true),
                    IsRefundUserInitiated = table.Column<bool>(nullable: false),
                    IsSystemInitiated = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderRefunds", x => x.OrderRefundId);
                    table.ForeignKey(
                        name: "FK_OrderRefunds_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderRefunds_PaymentProviderFields_PaymentProviderFieldSetId",
                        column: x => x.PaymentProviderFieldSetId,
                        principalTable: "PaymentProviderFields",
                        principalColumn: "PaymentProviderFieldSetId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VendorEarnings",
                columns: table => new
                {
                    VendorEarningId = table.Column<Guid>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    TutorId = table.Column<Guid>(nullable: true),
                    CompanyId = table.Column<Guid>(nullable: true),
                    OrderId = table.Column<Guid>(nullable: false),
                    ClassSessionId = table.Column<Guid>(nullable: false),
                    PaymentProviderFieldSetId = table.Column<Guid>(nullable: true),
                    VendorPayoutId = table.Column<Guid>(nullable: true),
                    EarningAmount = table.Column<decimal>(type: "decimal(13,4)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VendorEarnings", x => x.VendorEarningId);
                    table.ForeignKey(
                        name: "FK_VendorEarnings_ClassSessions_ClassSessionId",
                        column: x => x.ClassSessionId,
                        principalTable: "ClassSessions",
                        principalColumn: "ClassSessionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VendorEarnings_Companys_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companys",
                        principalColumn: "CompanyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VendorEarnings_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VendorEarnings_PaymentProviderFields_PaymentProviderFieldSetId",
                        column: x => x.PaymentProviderFieldSetId,
                        principalTable: "PaymentProviderFields",
                        principalColumn: "PaymentProviderFieldSetId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VendorEarnings_Tutors_TutorId",
                        column: x => x.TutorId,
                        principalTable: "Tutors",
                        principalColumn: "TutorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VendorEarnings_VendorPayouts_VendorPayoutId",
                        column: x => x.VendorPayoutId,
                        principalTable: "VendorPayouts",
                        principalColumn: "VendorPayoutId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionAttendees_AttendeeRefundId",
                table: "SessionAttendees",
                column: "AttendeeRefundId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionAttendees_OrderId",
                table: "SessionAttendees",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionAttendees_OrderItemId",
                table: "SessionAttendees",
                column: "OrderItemId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionAttendees_VendorEarningId",
                table: "SessionAttendees",
                column: "VendorEarningId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseInvites_OrderItemId",
                table: "CourseInvites",
                column: "OrderItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_CourseId",
                table: "OrderItems",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_IsDeleted",
                table: "OrderItems",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderRefunds_IsDeleted",
                table: "OrderRefunds",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_OrderRefunds_OrderId",
                table: "OrderRefunds",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderRefunds_PaymentProviderFieldSetId",
                table: "OrderRefunds",
                column: "PaymentProviderFieldSetId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_IsDeleted",
                table: "Orders",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_PayerUserId",
                table: "Orders",
                column: "PayerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_PaymentProviderFieldSetId",
                table: "Orders",
                column: "PaymentProviderFieldSetId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_PromoCodeId",
                table: "Orders",
                column: "PromoCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentProviderFields_IsDeleted",
                table: "PaymentProviderFields",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_VendorEarnings_ClassSessionId",
                table: "VendorEarnings",
                column: "ClassSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_VendorEarnings_CompanyId",
                table: "VendorEarnings",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_VendorEarnings_IsDeleted",
                table: "VendorEarnings",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_VendorEarnings_OrderId",
                table: "VendorEarnings",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_VendorEarnings_PaymentProviderFieldSetId",
                table: "VendorEarnings",
                column: "PaymentProviderFieldSetId");

            migrationBuilder.CreateIndex(
                name: "IX_VendorEarnings_TutorId",
                table: "VendorEarnings",
                column: "TutorId");

            migrationBuilder.CreateIndex(
                name: "IX_VendorEarnings_VendorPayoutId",
                table: "VendorEarnings",
                column: "VendorPayoutId");

            migrationBuilder.CreateIndex(
                name: "IX_VendorPayouts_CompanyId",
                table: "VendorPayouts",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_VendorPayouts_IsDeleted",
                table: "VendorPayouts",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_VendorPayouts_PaymentProviderFieldSetId",
                table: "VendorPayouts",
                column: "PaymentProviderFieldSetId");

            migrationBuilder.CreateIndex(
                name: "IX_VendorPayouts_TutorId",
                table: "VendorPayouts",
                column: "TutorId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseInvites_OrderItems_OrderItemId",
                table: "CourseInvites",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "OrderItemId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionAttendees_OrderRefunds_AttendeeRefundId",
                table: "SessionAttendees",
                column: "AttendeeRefundId",
                principalTable: "OrderRefunds",
                principalColumn: "OrderRefundId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionAttendees_Orders_OrderId",
                table: "SessionAttendees",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionAttendees_OrderItems_OrderItemId",
                table: "SessionAttendees",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "OrderItemId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionAttendees_VendorEarnings_VendorEarningId",
                table: "SessionAttendees",
                column: "VendorEarningId",
                principalTable: "VendorEarnings",
                principalColumn: "VendorEarningId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseInvites_OrderItems_OrderItemId",
                table: "CourseInvites");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionAttendees_OrderRefunds_AttendeeRefundId",
                table: "SessionAttendees");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionAttendees_Orders_OrderId",
                table: "SessionAttendees");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionAttendees_OrderItems_OrderItemId",
                table: "SessionAttendees");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionAttendees_VendorEarnings_VendorEarningId",
                table: "SessionAttendees");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "OrderRefunds");

            migrationBuilder.DropTable(
                name: "VendorEarnings");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "VendorPayouts");

            migrationBuilder.DropTable(
                name: "PaymentProviderFields");

            migrationBuilder.DropIndex(
                name: "IX_SessionAttendees_AttendeeRefundId",
                table: "SessionAttendees");

            migrationBuilder.DropIndex(
                name: "IX_SessionAttendees_OrderId",
                table: "SessionAttendees");

            migrationBuilder.DropIndex(
                name: "IX_SessionAttendees_OrderItemId",
                table: "SessionAttendees");

            migrationBuilder.DropIndex(
                name: "IX_SessionAttendees_VendorEarningId",
                table: "SessionAttendees");

            migrationBuilder.DropIndex(
                name: "IX_CourseInvites_OrderItemId",
                table: "CourseInvites");

            migrationBuilder.DropColumn(
                name: "AttendeeRefundId",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "OrderItemId",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "VendorAmount",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "VendorEarningId",
                table: "SessionAttendees");

            migrationBuilder.DropColumn(
                name: "OrderItemId",
                table: "CourseInvites");

            migrationBuilder.AddColumn<bool>(
                name: "IsRefundStudentInitiated",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PaymentIntentId",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RefundedAmount",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "RefundedBy",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RefundedDate",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripePayoutError",
                table: "SessionAttendees",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TutorPaid",
                table: "SessionAttendees",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TutorPaymentFailureNote",
                table: "SessionAttendees",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TutorStripePayoutId",
                table: "SessionAttendees",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TutorStripeTransferId",
                table: "SessionAttendees",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "StandingOutPercentageCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "StandingOutActualCut",
                table: "SessionAttendees",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);
        }
    }
}
